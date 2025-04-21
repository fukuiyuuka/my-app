-- CreateTable
CREATE TABLE "Task" (
    "userId" INTEGER NOT NULL,
    "taskId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "details" TEXT NOT NULL,
    "due" TIMESTAMP(3) NOT NULL,
    "done" BOOLEAN NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("userId","taskId")
);

-- CreateTable
CREATE TABLE "SubTask" (
    "userId" INTEGER NOT NULL,
    "taskId" INTEGER NOT NULL,
    "subTaskId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "details" TEXT NOT NULL,
    "due" TIMESTAMP(3) NOT NULL,
    "done" BOOLEAN NOT NULL,

    CONSTRAINT "SubTask_pkey" PRIMARY KEY ("userId","taskId","subTaskId")
);

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubTask" ADD CONSTRAINT "SubTask_userId_taskId_fkey" FOREIGN KEY ("userId", "taskId") REFERENCES "Task"("userId", "taskId") ON DELETE CASCADE ON UPDATE CASCADE;
