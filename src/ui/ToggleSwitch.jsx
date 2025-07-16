const ToggleSwitch = ({ checked, onChange, disabled = false }) => (
  <div className="flex items-center space-x-3">
    <span
      className={`text-sm font-medium ${
        checked ? "text-gray-400" : "text-orange-400"
      }`}
    >
      Pending
    </span>
    <button
      onClick={onChange}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800 ${
        checked ? "bg-green-600" : "bg-gray-600"
      } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
    <span
      className={`text-sm font-medium ${
        checked ? "text-green-400" : "text-gray-400"
      }`}
    >
      Completed
    </span>
  </div>
);

export default ToggleSwitch;
