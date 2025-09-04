import React, { useState } from 'react';
import { Plus, Calendar, Flag, CheckCircle, Clock } from 'lucide-react';
import { Assignment, Course } from '../../types';
import AssignmentForm from './AssignmentForm';

interface AssignmentManagerProps {
  assignments: Assignment[];
  courses: Course[];
  onAdd: (assignment: Omit<Assignment, 'id' | 'created_at' | 'user_id'>) => void;
  onEdit: (id: string, assignment: Omit<Assignment, 'id' | 'created_at' | 'user_id'>) => void;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string) => void;
}

const AssignmentManager: React.FC<AssignmentManagerProps> = ({
  assignments,
  courses,
  onAdd,
  onEdit,
  onDelete,
  onToggleComplete,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  const filteredAssignments = assignments.filter(assignment => {
    if (filter === 'pending') return !assignment.completed;
    if (filter === 'completed') return assignment.completed;
    return true;
  }).sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime());

  const handleEdit = (assignment: Assignment) => {
    setEditingAssignment(assignment);
    setShowForm(true);
  };

  const handleFormSubmit = (assignmentData: Omit<Assignment, 'id' | 'created_at' | 'user_id'>) => {
    if (editingAssignment) {
      onEdit(editingAssignment.id, assignmentData);
    } else {
      onAdd(assignmentData);
    }
    setShowForm(false);
    setEditingAssignment(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingAssignment(null);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Assignments</h1>
          <p className="text-gray-600 mt-1">Track and manage your coursework</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2 shadow-md"
        >
          <Plus size={20} />
          <span>Add Assignment</span>
        </button>
      </div>

      {showForm && (
        <AssignmentForm
          courses={courses}
          initialData={editingAssignment}
          onSubmit={handleFormSubmit}
          onCancel={handleCancel}
        />
      )}

      {/* Filter Tabs */}
      <div className="bg-white rounded-xl shadow-md p-1 flex w-fit">
        {[
          { key: 'all', label: 'All' },
          { key: 'pending', label: 'Pending' },
          { key: 'completed', label: 'Completed' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key as any)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === tab.key
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Assignments List */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {filteredAssignments.length === 0 ? (
          <div className="text-center py-12">
            <Clock className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-500 text-lg">No assignments found</p>
            <p className="text-gray-400">Create your first assignment to get started</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredAssignments.map((assignment) => {
              const daysUntilDue = getDaysUntilDue(assignment.due_date);
              const isOverdue = daysUntilDue < 0 && !assignment.completed;
              
              return (
                <div
                  key={assignment.id}
                  className={`p-6 hover:bg-gray-50 transition-colors ${
                    assignment.completed ? 'opacity-75' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <button
                        onClick={() => onToggleComplete(assignment.id)}
                        className={`mt-1 p-1 rounded-full transition-colors ${
                          assignment.completed
                            ? 'text-green-600 hover:text-green-700'
                            : 'text-gray-400 hover:text-green-600'
                        }`}
                      >
                        <CheckCircle size={20} />
                      </button>
                      
                      <div className="flex-1">
                        <h3 className={`text-lg font-semibold ${
                          assignment.completed ? 'line-through text-gray-500' : 'text-gray-900'
                        }`}>
                          {assignment.title}
                        </h3>
                        <p className="text-gray-600 mt-1">{assignment.description}</p>
                        
                        <div className="flex items-center space-x-4 mt-3">
                          <span className="text-sm text-gray-500 flex items-center">
                            <Calendar size={14} className="mr-1" />
                            {assignment.course?.name}
                          </span>
                          
                          <span className={`text-sm flex items-center ${
                            isOverdue ? 'text-red-600' : 'text-gray-500'
                          }`}>
                            <Clock size={14} className="mr-1" />
                            {isOverdue 
                              ? `Overdue by ${Math.abs(daysUntilDue)} days`
                              : daysUntilDue === 0 
                              ? 'Due today'
                              : `Due in ${daysUntilDue} days`
                            }
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(assignment.priority)}`}>
                        <Flag size={12} className="inline mr-1" />
                        {assignment.priority}
                      </span>
                      
                      <div className="flex space-x-1">
                        <button
                          onClick={() => handleEdit(assignment)}
                          className="text-gray-400 hover:text-indigo-600 transition-colors p-1"
                        >
                          <Calendar size={16} />
                        </button>
                        <button
                          onClick={() => onDelete(assignment.id)}
                          className="text-gray-400 hover:text-red-600 transition-colors p-1"
                        >
                          <CheckCircle size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignmentManager;