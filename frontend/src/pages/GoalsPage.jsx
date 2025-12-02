import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import GoalCard from "../components/goals/GoalCard";
import { apiService } from "../services/api";

const GoalForm = ({ onSuccess }) => {
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data) => {
    try {
      await apiService.goals.create(data);
      reset();
      onSuccess && onSuccess();
    } catch (error) {
      alert("Failed to create goal");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white shadow-lg p-6 rounded-xl space-y-4"
    >
      <div>
        <label>Title</label>
        <input
          {...register("title", { required: true })}
          className="w-full mt-1 p-2 border rounded-lg"
          placeholder="Learn React"
        />
      </div>

      <div>
        <label>Description</label>
        <textarea
          {...register("description")}
          className="w-full mt-1 p-2 border rounded-lg"
          placeholder="Describe your goal"
        />
      </div>

      <div>
        <label>Target Date</label>
        <input
          type="date"
          {...register("target_date")}
          className="w-full mt-1 p-2 border rounded-lg"
        />
      </div>

      <button
        type="submit"
        className="w-full py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700"
      >
        Create Goal
      </button>
    </form>
  );
};

const GoalsPage = () => {
  const [goals, setGoals] = useState([]);

  const fetchGoals = async () => {
    try {
      const res = await apiService.goals.getAll();
      setGoals(res.data?.data || []);
    } catch {
      setGoals([]);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-800">My Learning Goals</h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Create Goal */}
        <div className="md:col-span-1">
          <GoalForm onSuccess={fetchGoals} />
        </div>

        {/* Goal List */}
        <div className="md:col-span-2 grid gap-6">
          {goals.length > 0 ? (
            goals.map((goal) => (
              <GoalCard key={goal.id} goal={goal} />
            ))
          ) : (
            <div className="text-center text-gray-600 mt-10">
              No goals yet. Create one to begin!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GoalsPage;

