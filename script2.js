"use strict";

class TaskManager {
  constructor(name, description, assignee, date, status) {
    // refresh id_arr to keep track tasks that were created
    this.id_arr = JSON.parse(localStorage.getItem("id_arr"));
    /* Method 1 to get input from form field.
    this.name = document.querySelector("#taskName");
      Method 2 to get input from form field. id and name can be interchanged.
    https://www.dyn-web.com/tutorials/forms/references.php */
    this.name = name;
    this.description = description;
    this.assignee = assignee;
    this.date = date;
    this.status = status;
    this.taskContainer = document.querySelector("#tasks");
  }

  refreshPage() {
    // clear everything on the page before loading content
    this.taskContainer.innerHTML = "";
    // in case id_arr in the local storage is empty, set it as an empty array. Otherwise, id_arr becomes null => break the program
    if (this.id_arr === null) {
      this.id_arr = [];
    }
    // run through the id_arr's element = key to look for task in local storage. For each id element, go to localStorage and getItem and parse it.
    this.id_arr.forEach((id) => {
      let postJsonTask = JSON.parse(localStorage.getItem(id));
      // debugger;
      // once the task is parsed from localstorage, it is an input to go to toHTML(), renderTask()
      const html = this.toHTML(postJsonTask);
      this.renderTask(html);
    });
  }

  createTask() {
    const name = this.name.value;
    const description = this.description.value;
    const assignee = this.assignee.value;
    const date = this.date.value;
    const status = this.status.value;
    const task = new Task(name, description, assignee, date, status);
    // return a task object which will be an input for toHTML(), renderTask()
    return task;
  }

  toHTML(task) {
    // 'https://www.designcise.com/web/tutorial/how-to-append-an-html-string-to-an-existing-dom-element-using-javascript'
    // 'https://grrr.tech/posts/create-dom-node-from-html-string/'
    // console.log(task);
    const html = `
    <div id='${task["id"]}' class="task-list row">
      <p class="col-2 text-left">${task["name"]}</p>
      <p class="col-3 text-left">${task["description"]}</p>
      <p class=" col-2 text-center">${task["assignee"]}</p>
      <p class="text-center col-2">${task["date"]}</p>
      <p class="col-2 text-center">${task["status"]}</p>
      <a href="#" data-toggle="tooltip" title="Edit" class="edit-btn" data-task-id='${task["id"]}'><img src="image/pencil-edit-button.svg" alt="pencil-edit-button" width="15" height="15"/></a>
      <a href="#" data-toggle="tooltip" title="Delete" class="delete-btn" data-task-id='${task["id"]}'><img src="image/trash.svg" alt="delete-button" width="15" height="15"/></a>
    </div>`;
    return html;
  }

  renderTask(html) {
    const taskElement = document.createRange().createContextualFragment(html);
    //  const edit = taskElement.querySelector(".edit");
    //  edit.addEventListener("click", editTask);
    this.taskContainer.appendChild(taskElement);
    // taskContainer.insertAdjacentHTML("beforeend", html);
  }

  toLocalStorage(task) {
    // Push new id to id_arr
    this.id_arr.push(task["id"]);
    // console.log(this.id_arr);
    // serialize the id_arr into string format to save in localstorage
    let json_id_arr = JSON.stringify(this.id_arr);
    // serialize the taskObj into string format to save in localstorage
    let json_task = JSON.stringify(task);
    // save to the local storage the id_arr containing all task id
    localStorage.setItem("id_arr", json_id_arr);
    // save to the local storage the task object
    localStorage.setItem(task["id"], json_task);
  }

  editTask(event) {
    console.log("It works");
    const edit = document.querySelector(".edit");
    $("#taskModal").modal("show");
    modal_title.innerText = "Edit Task";
    modal_title.value = modal_title.innerText;
    const taskElement = edit.target.closest("#id");
    // const edit = event.target;
    // // const task = this.tasks.find((t) => taskElement.id === t.id);

    // console.log(taskElement.id);

    // const task = taskManager.taskList.find((t) => taskElement.id === t.id); // What does this line mean?

    // taskIdInput.value = task.id;
    // taskNameInput.value = task.name;
    // taskDescriptionInput.value = task.description;
    // taskAssigneeInput.value = task.assignee;
    // taskDateInput.value = task.date;
    // // taskTimeInput.value = task.time;
    // taskStatusInput.value = task.status;

    // $("#task-modal").modal("show"); // What does this line mean?    //   const taskElement = event.target.closest(".task-list"); // What does this line mean?

    // console.log(taskElement);
  }

  filterTask(stt) {
    let post_json_taskByStatus = [];
    this.id_arr.forEach(function (id) {
      post_json_taskByStatus.push(JSON.parse(localStorage.getItem(id)));
    });

    // When filter status = All
    if (stt === "All") {
      // taskByStatus = post_json_taskByStatus;
      this.taskContainer.innerHTML = "";
      post_json_taskByStatus.forEach((task) => {
        const html = this.toHTML(task);
        this.renderTask(html);
      });
    }
    // When filter status = To Do, In Progress, Review, Done
    else {
      this.taskContainer.innerHTML = "";
      post_json_taskByStatus.forEach((task) => {
        if (task["status"] === stt) {
          const html = this.toHTML(task);
          this.renderTask(html);
        }
      });
    }
  }

  deleteButtonnClicked() {
    /* Because the Delete Icon doesnt exist in HTML so we have to capture the event 
    (which is created by clicking to the Delete icon) 
    on the parent container (which exists in the HTML).
    This is due to the Event Bubbling.*/
    const container_del = document.querySelector("#accordion");
    // Parent container listens to the "click" event from the children and run the function
    container_del.addEventListener("click", (event) => {
      // debugger;

      /* When the event is listened, go find (target) the closest .delete-btn. 
      The closest() method traverses the Element and its parents (heading toward the document root) 
      until it finds a node that matches the provided selector string. 
      Will return itself or the matching ancestor. If no such element exists, it returns null. */
      const del_btn = event.target.closest(".delete-btn");

      /* If there is a .delete-del_btn, wrap the attribute called "data-task-id" = id of the particular task.
      "data-task-id" = input to run deleteTask() */
      if (del_btn) {
        const id_del = del_btn.getAttribute("data-task-id");
        this.deleteTask(id_del);
      }
    });
  }

  deleteTask(id_del) {
    // console.log(id_del);
    // console.log("deleteTask func works");
    localStorage.removeItem(id_del);
    this.id_arr = this.id_arr.filter((element) => {
      // debugger;
      return element !== id_del;
    });

    localStorage.setItem("id_arr", JSON.stringify(this.id_arr));
    // console.log(this.id_arr);

    this.refreshPage();
    // this.id_arr.forEach((id) => {
    //   this.renderTask(JSON.parse(localStorage.getItem(id)));
    // });
  }

  // To clear the old content in the form fields
  resetForm() {
    document.querySelector("#task-form").reset();
  }

  // To disable the Save button in the form until certain validation requirements are met
  disableBtn() {
    document.querySelector("#task-modal-save").disabled = true;
  }

  validation() {
    const name = this.name;
    const description = this.description;
    const assignee = this.assignee;
    const date = this.date;

    name.addEventListener("focus", validate);
    description.addEventListener("focus", validate);
    assignee.addEventListener("focus", validate);
    date.addEventListener("change", validate);

    //    ============================ Validate form===============================
    function validate() {
      const taskName = name.value.trim();
      const descriptionInput = description.value.trim();
      const assigne = assignee.value.trim();

      // =============================Task name validation========================
      if (taskName == "" || taskName.length < 8) {
        error(name, "Enter a task name with 8 or more char");
      } else {
        submit(name);
      }

      // =============================Description validation========================
      if (descriptionInput == "" || descriptionInput.length < 15) {
        error(description, "Enter task description with 15 or more char");
      } else {
        submit(description);
      }

      // =============================Assignee validation========================
      if (assigne == "" || assigne.length < 4) {
        error(assignee, "Enter assignee name with more than 4 cha");
      } else {
        submit(assignee);
      }

      // =============================Date validation========================
      const dateInpute = date.value;
      var currentDate = new Date().toISOString().slice(0, 10);

      // console.log(date);
      if (dateInpute == null || dateInpute == "") {
        error(date, "Task must have a due date");
      } else if (dateInpute < currentDate) {
        error(date, "Task cannot be created in past date");
      } else {
        submit(date);
      }
    }

    function error(input, message) {
      const formgroup = input.parentElement;
      const err = formgroup.querySelector("#err");
      err.innerText = message;
      err.style.color = "red";
      formgroup.className = "form-group error";
      document.querySelector("#task-modal-save").disabled = true;
    }

    function submit(input) {
      const formgroup = input.parentElement;
      const err = formgroup.querySelector("#err");
      err.innerText = "Looks good!";
      err.style.color = "green";
      formgroup.className = "form-group success";
      document.querySelector("#task-modal-save").disabled = false;
    }
  }

  // Update task to tasklist
  //   updateTask(id, name, description, assignee, date, status) {
  //     for (let i = 0; i < this.taskList.length; i++) {
  //       if (this.taskList[i].id === id) {
  //         this.taskList[i].name = name;
  //         this.taskList[i].description = description;
  //         this.taskList[i].assignee = assignee;
  //         this.taskList[i].date = date;
  //         // this.taskList[i].time = time;
  //         this.taskList[i].status = status;
  //         // this.taskList[i].priority = priority;
  //         break;
  //       }
  //     }
  //   }
}

class Task {
  constructor(name, description, assignee, date, status) {
    this.id = Date.now().toString();
    this.name = name;
    this.description = description;
    this.assignee = assignee;
    this.date = date;
    this.status = status;
  }
}

// function editTaskClicked(event) {
//   // clearValidation(); // What does this line mean?

//   const taskElement = event.target.closest(".task-list"); // What does this line mean?
//   const task = taskManager.taskList.find((t) => taskElement.id === t.id); // What does this line mean?

//   taskIdInput.value = task.id;
//   taskNameInput.value = task.name;
//   taskDescriptionInput.value = task.description;
//   taskAssigneeInput.value = task.assignee;
//   taskDateInput.value = task.date;
//   // taskTimeInput.value = task.time;
//   taskStatusInput.value = task.status;

//   $("#task-modal").modal("show"); // What does this line mean?
// }

// Why cant the arg for this func is the obj task which was created in addTask func?
function updateTask(id, name, description, assignee, date, status) {
  taskManager.updateTask(id, name, description, assignee, date, status);
}

// Execution
// use "DOMContentLoaded" for safety, to ensure all the neccessary content is loaded.
document.addEventListener("DOMContentLoaded", function () {
  const form = document.forms["task-form"];
  // const name = document.querySelector('name')
  const name = form.taskName;
  const description = form.description;
  const assignee = form.assignee;
  const date = form.date;
  const status = form.status;
  const taskManager = new TaskManager(
    name,
    description,
    assignee,
    date,
    status
  );
  const taskCreateButton = document.querySelector("#create_btn");
  const taskModalSaveButton = document.querySelector("#task-modal-save");
  const filter_dropDown = document.querySelector(".filter_dropDown");

  taskManager.refreshPage();
  taskManager.deleteButtonnClicked();
  filter_dropDown.value = "All";

  taskCreateButton.addEventListener("click", function () {
    taskManager.disableBtn();
    taskManager.resetForm();
    taskManager.validation();
  });

  taskModalSaveButton.addEventListener("click", function () {
    const taskObj = taskManager.createTask();
    const html = taskManager.toHTML(taskObj);
    taskManager.renderTask(html);
    taskManager.toLocalStorage(taskObj);
    // console.log(taskManager.id_arr);
  });

  filter_dropDown.addEventListener("click", function () {
    taskManager.filterTask(filter_dropDown.value);
  });
});
