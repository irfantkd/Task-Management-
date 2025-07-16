const Statistics = ({ totalTasks, pendingTasks, completedTasks }) => (
  <div className="flex items-center space-x-3">
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 backdrop-blur-sm">
      <span className="text-sm text-gray-300">Total: </span>
      <span className="text-white font-semibold">{totalTasks}</span>
    </div>
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 backdrop-blur-sm">
      <span className="text-sm text-gray-300">Pending: </span>
      <span className="text-orange-400 font-semibold">{pendingTasks}</span>
    </div>
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 backdrop-blur-sm">
      <span className="text-sm text-gray-300">Completed: </span>
      <span className="text-green-400 font-semibold">{completedTasks}</span>
    </div>
  </div>
);

export default Statistics;
