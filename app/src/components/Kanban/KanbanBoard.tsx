import { useEffect, useState } from 'react';
import { RiArrowLeftSLine as  ChevronLeft, Plus } from '../icons';
// import { Task, TaskStatus, PriorityLevel, ColumnData, SwimLane } from './types/task';
import { SwimLane } from './types/task';
import { TaskStatus, TaskPriority } from './types/task';
import type { Task } from './types/task'

import SwimLaneRow from './SwimLaneRow';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
  DragOverlay,
  defaultDropAnimationSideEffects,
  DropAnimation,
  pointerWithin,
  closestCenter,
  getFirstCollision,
  UniqueIdentifier
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import TaskCard from './TaskCard';
import { useNavigate } from 'react-router-dom';



// Custom drop animation
const dropAnimation: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: '0.5',
      },
    },
  }),
};

export default function KanbanBoard({ projectId, tasks, topics, goBack, onChooseTask, setTasks, updateTask }: { projectId: string, tasks: Task[], topics: SwimLane[], goBack: () => void, onChooseTask: (task: Task) => void, setTasks: (tasks: Task[]) => void , updateTask: (task: Task) => void }) {
  const swimLanes = topics;

  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeContainer, setActiveContainer] = useState<string | null>(null);
  const [overContainer, setOverContainer] = useState<string | null>(null);
  const [lastOverId, setLastOverId] = useState<string | null>(null);
  const [clonedTasks, setClonedTasks] = useState<Task[]>(tasks);

  useEffect(() => {
    setClonedTasks(tasks);
  }, [tasks]);

  // const setTasks = (newTasks: Task[]) => {
  //   // Update the tasks state with the new tasks
  //   console.log('Setting new tasks:', newTasks);
  //   // Here you would typically update the state in a parent component or context
  //   // For this example, we will just log the new tasks
  //   console.log('Tasks updated:', newTasks);
  // };

  // console.log('KanbanBoard rendered with tasks:', tasks, 'swimLanes:', swimLanes);

  // Configure sensors with appropriate activation constraints
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 5, // Start dragging after moving 5px
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 100, // Small delay for touch to distinguish from scroll
        tolerance: 5, // Small tolerance for touch
      },
    })
  );

  // Find the container a task belongs to
  const findContainer = (id: string) => {
    if (id.includes('-')) {
      return id;
    }

    const task = tasks.find(task => task.id === id);
    if (task) {
      return `${task.card_id}-${task.status}`;
    }

    return null;
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const activeTaskId = active.id as string;
    const task = tasks.find(t => t.id === activeTaskId);

    if (task) {
      // Store a clone of the tasks for restoration if needed
      setClonedTasks([...tasks]);

      setActiveTask({...task}); // Create a copy of the task
      setActiveId(activeTaskId);

      // Set the active container to the task's current status and swimLane
      const container = `${task.card_id}-${task.status}`;
      setActiveContainer(container);
      setOverContainer(container);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Find the active task
    const activeTask = tasks.find(task => task.id === activeId);
    if (!activeTask) return;

    // Find the containers
    const activeContainer = findContainer(activeId);
    const overContainer = findContainer(overId);

    if (!activeContainer || !overContainer) return;

    // Update the over container state
    setOverContainer(overContainer);
    setLastOverId(overId);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || !activeTask || !activeId || !activeContainer) {
      // If something went wrong, restore the original tasks
      setTasks(clonedTasks);
      resetDragState();
      return;
    }

    const overId = over.id as string;
    const targetContainer = findContainer(overId);

    if (!targetContainer) {
      // If we couldn't find the target container, restore the original tasks
      setTasks(clonedTasks);
      resetDragState();
      return;
    }

    // Make a copy of the current tasks to work with
    let newTasks = [...tasks];

    // If we're dropping onto a different container
    if (activeContainer !== targetContainer) {
      const [card_id, status] = targetContainer.split('-');

      // Update the task's status and card_id
      newTasks = newTasks.map(task =>
        task.id === activeId
          ? { ...task, status: status as TaskStatus, card_id }
          : task
      );
    }
    // If we're dropping onto a different task in the same container, we need to reorder
    else if (activeId !== overId && !overId.includes('-')) {
      // Find the active task
      const activeTask = newTasks.find(t => t.id === activeId);
      if (!activeTask) {
        resetDragState();
        return;
      }

      // Get the container tasks
      const containerTasks = newTasks.filter(t =>
        t.card_id === activeTask.card_id &&
        t.status === activeTask.status
      );

      // Find the indices in the container
      const activeIndex = containerTasks.findIndex(t => t.id === activeId);
      const overIndex = containerTasks.findIndex(t => t.id === overId);

      if (activeIndex === -1 || overIndex === -1) {
        resetDragState();
        return;
      }

      // Create a new array with the tasks in the new order
      const newContainerTasks = arrayMove(
        containerTasks,
        activeIndex,
        overIndex
      );

      // Replace the tasks in the original array
      newTasks = newTasks.map(task => {
        if (task.card_id === activeTask.card_id && task.status === activeTask.status) {
          const index = newContainerTasks.findIndex(t => t.id === task.id);
          if (index !== -1) {
            return newContainerTasks[index];
          }
        }
        return task;
      });
    }
    // If we're dropping onto an empty container
    else if (overId.includes('-') && overId === targetContainer) {
      const [card_id, status] = targetContainer.split('-');

      // Update the task's status and card_id
      newTasks = newTasks.map(task =>
        task.id === activeId
          ? { ...task, status: status as TaskStatus, card_id }
          : task
      );
    }

    // Update the tasks state with our new tasks
    setTasks(newTasks);

    // Reset all the drag state
    resetDragState();
  };

  const resetDragState = () => {
    setActiveTask(null);
    setActiveId(null);
    setActiveContainer(null);
    setOverContainer(null);
    setLastOverId(null);
  };

  const handleDragCancel = () => {
    // Restore the original tasks
    setTasks(clonedTasks);
    resetDragState();
  };

  const toggleTaskCheck = (taskId: string) => {
    setTasks(tasks.map(task =>
      task.id === taskId
        ? {
            ...task,
            isDone: !task.isDone,
            status: !task.isDone ? TaskStatus.Done : task.status
          }
        : task
    ));
  };

  // Custom collision detection strategy
  const collisionDetectionStrategy = (args: any) => {
    // First, let's check for direct collisions with pointer
    const pointerCollisions = pointerWithin(args);

    if (pointerCollisions.length > 0) {
      // If we have collisions, return them
      const firstCollision = getFirstCollision(pointerCollisions, 'id');
      if (firstCollision) {
        return pointerCollisions;
      }
      return [];
    }

    // If no direct collisions, use closest center
    return closestCenter(args);
  };

  return (
    <div className="flex flex-col h-screen bg-white pb-20">
      {/* Subheader */}
      <div className="flex items-center px-6 py-2 bg-white border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <button className="p-1 text-gray-500 rounded-full hover:bg-gray-100" onClick={goBack}>
            &lt;- Back
          </button>
          {/* <button className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
            All tasks
          </button>
          <div className="flex items-center">
            <span className="text-sm text-gray-500">Assigned to:</span>
            <button className="ml-2 text-sm text-gray-700 hover:text-purple-600">
              select
            </button>
          </div> */}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto flex flex-row" style={{
        overscrollBehavior: 'contain', // Prevents overscroll behavior
       }}>
        <DndContext
          sensors={sensors}
          collisionDetection={collisionDetectionStrategy}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <div className="">
            {/* Column Headers */}
            <div className="flex sticky top-0 z-20 bg-white">
              <div className="flex-shrink-0 w-[200px] h-[56px] flex items-center p-4 font-medium text-gray-700 border-b border-r border-gray-200">
                <span>Topic</span>
              </div>
              <div className="flex flex-1">

                  {Object.keys(TaskStatus).map(status => (
                    <div className="w-[280px] h-[56px] flex items-center justify-between p-4 font-medium text-gray-700 border-b border-r border-gray-200">
                      <div key={status} className="flex items-center space-x-2">
                        <span>{status.replace(/([A-Z])/g, ' $1')}</span>
                        <span className="text-gray-500">•</span>
                        <span className="text-gray-500">
                          {tasks.filter(task => task.status === status).length}
                        </span>
                      </div>
                    </div>
                  ))}

                {/* <div className="flex-shrink-0 w-[60px] h-[56px] flex items-center justify-center border-b border-gray-200">
                  <button className="p-2 text-white bg-purple-600 rounded-md hover:bg-purple-700">
                    <Plus />
                  </button>
                </div> */}
              </div>
            </div>

            {/* Swim Lanes */}
            {swimLanes.map(swimLane => (
              <SwimLaneRow
                key={swimLane.id}
                swimLane={swimLane}
                tasks={tasks.filter(task => task.card_id === swimLane.id)}
                onToggleCheck={toggleTaskCheck}
                activeId={activeId}
                activeContainer={activeContainer}
                overContainer={overContainer}
                lastOverId={lastOverId}
                onChooseTask={onChooseTask}
              />
            ))}
          </div>

          {/* Drag Overlay - shows the task being dragged */}
          <DragOverlay dropAnimation={dropAnimation}>
            {activeTask ? (
              <div className="w-[260px]">
                <TaskCard
                  task={activeTask}
                  onToggleCheck={toggleTaskCheck}
                  isDragOverlay
                />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}
