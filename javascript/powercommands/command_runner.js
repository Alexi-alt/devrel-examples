const commands = {
  list: 'list',
  complete: 'complete',
  incomplete: 'incomplete',
  comment: 'comment',
};

const getCommand = argv => {
  if (argv._.length == 0 && argv.save) {
    console.log('No command specified, so configured connection settings without executing command');
    return;
  } else if (argv._.length !== 1) {
    throw new Error(`Specifify exactly one command from the set: ${Object.keys(commands).join(', ')}`);
  }
  const command = argv._[0];
  if (!(command in commands)) {
    throw new Error(`Command not recognized: ${command}. Specifify exactly one command from the set: ${Object.keys(commands).join(', ')}`);
  }
  console.log('Selected command:', command);
  if (command in validateArgs) validateArgs[command](argv);
  return command;
};

const validateArgs = {
  comment: argv => {
    if (!argv.message) throw new Error(`Command 'comment' requires a 'message' argument`);
  },
};

const runCommand = async (client, command, task, argv) => {
  switch (command) {
    case commands.list:
      console.log('Listing task:', task);
      return;
    case commands.complete:
      console.log('Completing task:', task);
      const completedTask = await client.tasks.update(task.gid, {
        completed: true,
      });
      console.log('Completed task:', completedTask);
      return;
    case commands.incomplete:
      console.log('Incompleting task:', task);
      const incompletedTask = await client.tasks.update(task.gid, {
        completed: false,
      });
      console.log('Incompleted task:', incompletedTask);
      return;
    case commands.comment:
      console.log('Commenting on task', task, 'message', argv.message);
      const comment = await client.tasks.addComment(task.gid, {
        text: argv.message,
      })
      console.log('Commented on task', comment);
      return;
    default:
      throw new Error(`Command not recognized: ${command}. Specifify exactly one command from the set: ${Object.keys(commands).join(', ')}`);
  }
};

module.exports = {
  getCommand,
  runCommand,
};
