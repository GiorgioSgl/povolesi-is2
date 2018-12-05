const TaskPoolService = require('../../src/services/task_pool_service');
const TaskHelper = require('../helpers/task_helper');
const UserHelper = require('../helpers/user_helper');

async function insertArrayTaskPool(taskPools) {
    for (let i = 0; i < taskPools.length; i++) {
        await TaskPoolService.createTaskPool(taskPools[i]);
    }
}


describe('creation of taskPool', () => {

    test('insert taskPool', async () => {
        const creator = await UserHelper.insertMario();
        const taskPoolExample = {
            name: 'esempio',
            createdBy: creator
        };

        const createdPool = await TaskPoolService.createTaskPool(taskPoolExample);

        expect(createdPool.name).toEqual(taskPoolExample.name);
        expect(createdPool.createdBy.toJSON()).toEqual(creator.toJSON());
    });

    test('insert taskPool with a task', async () => {

        const creator = await UserHelper.insertMario();

        const taskPoolExample = {
            name: 'esempio',
            createdBy: creator
        };
        const task = await TaskHelper.createOpenQuestionTask(creator.id);


        const createdPool = await TaskPoolService.createTaskPool(taskPoolExample, [task]);

        expect(createdPool.name).toEqual(taskPoolExample.name);
        expect(createdPool.createdBy.toJSON()).toEqual(creator.toJSON());

        const tasksFromPool = await createdPool.getTasks();
        expect(tasksFromPool[0].id).toEqual(task.id);
    });

    test('insert taskPool without specifying the user', async () => {
        const taskPool = {
            name: 'esempio',
        };

        try {
            await TaskPoolService.createTaskPool(taskPool);
        } catch (e) {
            expect(e.message).toBe(TaskPoolService.errors.NO_CREATOR_SPECIFIED);
        }
    });

    test('insert taskPool without specifying the name', async () => {
        const noTaskPool = {};

        try {
            await TaskPoolService.createTaskPool(noTaskPool);
        } catch (e) {
            expect(e.message).toBe(TaskPoolService.errors.NO_NAME);
        }
    });


});

describe('get my taskPool', () => {
    test('get my taskPools', async () => {
        const mario = await UserHelper.insertMario();
        const giorgio = await UserHelper.insertGiorgio();

        const taskPool1 = {
            name: 'esempio1',
            createdBy: giorgio
        };
        const taskPool2 = {
            name: 'esempio2',
            createdBy: giorgio
        };
        const taskPool3 = {
            name: 'esempio3',
            createdBy: mario
        };

        var array = [taskPool1, taskPool2, taskPool3];
        await insertArrayTaskPool(array);

        const result = await TaskPoolService.getMyTaskPool(giorgio);

        // control for any element of array that the creator is giorgio
        result.forEach((t) => expect(t.createdById).toEqual(giorgio.id));
    });

    test('get taskPools of user that no exist', async () => {
        const giorgio = {name: 'giorgio'};

        try {
            await TaskPoolService.getMyTaskPool(giorgio);
            expect(true).toBe(false);
        } catch (e) {
            expect(e.message).toBe(TaskPoolService.errors.USER_NOT_EXIST)
        }
    });

    test('user with no taskPool is an array empty', async () => {
        const giorgio = await UserHelper.insertGiorgio();

        const jsonArray = await TaskPoolService.getMyTaskPool(giorgio);
        expect(jsonArray.length).toEqual(0);
    });


});

/*describe('get task of task pool',() => {

})*/