// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract SalonBooking is Initializable, OwnableUpgradeable, ReentrancyGuardUpgradeable, UUPSUpgradeable {
    /// @dev commissione in basis points (10000 = 100%)
    uint256 public feeBps;                 // es. 300 = 3%
    address public treasury;               // destinazione commissioni
    uint256 public lastBookingId;          // contatore ID prenotazioni

    struct Booking {
        address user;      // chi ha prenotato
        uint256 when;      // timestamp appuntamento
        uint256 amount;    // importo pagato
        bool cancelled;    // flag cancellazione
    }

    mapping(uint256 => Booking) public bookings;
    mapping(address => uint256[]) public userBookings;

    event Booked(uint256 indexed id, address indexed user, uint256 when, uint256 amount);
    event Cancelled(uint256 indexed id, address indexed user, uint256 refund);
    event Rescheduled(uint256 indexed id, uint256 oldWhen, uint256 newWhen);
    event Withdrawn(address indexed to, uint256 amount);
    event FeeParamsChanged(uint256 feeBps, address treasury);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    /// @notice initializer del proxy (OZ v5: Ownable richiede initialOwner)
    function initialize(uint256 _feeBps, address _treasury) external initializer {
        __Ownable_init(msg.sender);
        __ReentrancyGuard_init();
        __UUPSUpgradeable_init();

        require(_treasury != address(0), "treasury=0");
        require(_feeBps <= 2_000, "fee too high"); // max 20% di sicurezza (personalizzabile)

        feeBps = _feeBps;
        treasury = _treasury;

        emit FeeParamsChanged(feeBps, treasury);
    }

    // ========= Core booking =========

    /// @notice crea una prenotazione pagando in anticipo
    function book(uint256 when, string calldata /*note*/) external payable nonReentrant returns (uint256 id) {
        require(when > block.timestamp + 10 minutes, "when too soon");
        require(msg.value > 0, "no value");

        unchecked { id = ++lastBookingId; }

        bookings[id] = Booking({
            user: msg.sender,
            when: when,
            amount: msg.value,
            cancelled: false
        });

        userBookings[msg.sender].push(id);

        emit Booked(id, msg.sender, when, msg.value);
    }

    /// @notice cancella una prenotazione prima dell’orario; rimborso = amount - fee
    function cancelBooking(uint256 id) external nonReentrant {
        Booking storage b = bookings[id];
        require(b.user == msg.sender, "not your booking");
        require(!b.cancelled, "already cancelled");
        require(block.timestamp < b.when, "too late");

        b.cancelled = true;

        uint256 fee = (b.amount * feeBps) / 10000;
        uint256 refund = b.amount - fee;

        // invio fee al treasury
        if (fee > 0) {
            (bool okFee, ) = payable(treasury).call{value: fee}("");
            require(okFee, "fee transfer failed");
        }

        // rimborso all’utente
        (bool ok, ) = payable(b.user).call{value: refund}("");
        require(ok, "refund failed");

        emit Cancelled(id, b.user, refund);
    }

    /// @notice riprogramma l’orario (prima dell’appuntamento)
    function rescheduleBooking(uint256 id, uint256 newWhen) external {
        Booking storage b = bookings[id];
        require(b.user == msg.sender, "not your booking");
        require(!b.cancelled, "cancelled");
        require(block.timestamp < b.when, "too late");
        require(newWhen > block.timestamp + 10 minutes, "new when too soon");

        uint256 oldWhen = b.when;
        b.when = newWhen;

        emit Rescheduled(id, oldWhen, newWhen);
    }

    // ========= Admin / fee / treasury =========

    function setFeeParams(uint256 _feeBps, address _treasury) external onlyOwner {
        require(_treasury != address(0), "treasury=0");
        require(_feeBps <= 2_000, "fee too high");
        feeBps = _feeBps;
        treasury = _treasury;
        emit FeeParamsChanged(feeBps, treasury);
    }

    /// @notice prelievo di eventuali fondi bloccati (solo owner)
    function withdraw(address to, uint256 amount) external onlyOwner nonReentrant {
        require(to != address(0), "to=0");
        (bool ok, ) = payable(to).call{value: amount}("");
        require(ok, "withdraw failed");
        emit Withdrawn(to, amount);
    }

    // ========= UUPS =========
    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}

    // ========= View helpers =========
    function bookingsOf(address user) external view returns (uint256[] memory) {
        return userBookings[user];
    }

    /// @notice Ritorna la versione del contratto implementata (per tracking upgrade).
    function version() external pure returns (string memory) {
        return "SalonBooking v2";
    }
}

