import axios from "axios";
import { votetypes, vote } from "./model/voteDTOs";
import { apiUrl } from "./constant/apiUrl";

var voteTypes: votetypes = [] as votetypes;
var voteTypeOpts: vote = {} as vote;
var selectedValue: string | undefined;

var mainOptions = document.querySelectorAll(".box");
var divider = document.querySelector(".divider");

//option for vote
var selectVoteTypeElement = document.querySelector("#vote-type");
var mainSelectVoteTypeElement = document.querySelector("#vote-type-form");
var formVoteOption = mainSelectVoteTypeElement.querySelector("form");
var voteTypeOptionsListElement = formVoteOption.querySelector("ul");
var formSubmitVoteOptionButtonElement = formVoteOption.querySelector("button");
var selectVoteType = formVoteOption.querySelector(
  "#vote-type"
) as HTMLSelectElement;

//create
var mainCreateVoteTypeElement = document.querySelector("#create-vote-form");
var formCreateElement = mainCreateVoteTypeElement.querySelector("form");
var optsElement = formCreateElement.querySelector(".vote-opt");
var addOptEvent = document.querySelector(".addBtn");
addOptEvent.addEventListener("click", () => createNewOption());
var button = formCreateElement.querySelector("button");
button.addEventListener("click", () => submitCreateFormEvent());

main();

function main() {
  getVoteTypes();
}

function getVoteTypes() {
  axios
    .get(`${apiUrl}getListofVotes`)
    .then(function (response) {
      var votes = response.data.data.votes as votetypes;
      if (votes.length > 0) {
        fillVoteTypes(votes);
        InitilizateSelectItemsForVoteType();
        changeDisplayBehaviourElements(
          [selectVoteTypeElement, divider],
          "remove"
        );
        addUserOptionsEvent();
      }
    })
    .catch(() => {
      changeDisplayBehaviourElements([selectVoteTypeElement, divider], "add");
    });
}

function changeDisplayBehaviourElements(elements: Element[], display: string) {
  elements.forEach((el) => {
    if (display == "add") {
      el.classList.add("hidden");
    } else {
      el.classList.remove("hidden");
    }
  });
}

function addUserOptionsEvent() {
  mainOptions.forEach((item) => {
    item.addEventListener("click", ($event) => {
      var target = $event.target as HTMLElement;
      // main element click
      if (target.tagName == "DIV") {
        var targetElement = target;
      } else {
        var targetElement = ($event.target as HTMLElement).parentElement;
      }

      item.classList.add("active");

      //remove active class
      mainOptions.forEach((el) => {
        if (el.id != item.id) {
          el.classList.remove("active");
        }
      });

      //hide & show elements
      if (targetElement.id == "create-vote") {
        mainCreateVoteTypeElement.classList.remove("hidden");
        mainSelectVoteTypeElement.classList.add("hidden");
      }
      if (targetElement.id == "vote-type") {
        mainSelectVoteTypeElement.classList.remove("hidden");
        mainCreateVoteTypeElement.classList.add("hidden");
      }
    });
  });
}

function fillVoteTypes(types: votetypes) {
  types.forEach((element) => {
    voteTypes.push(element);
  });
}

function InitilizateSelectItemsForVoteType() {
  voteTypes.forEach((type) => {
    var createOption = document.createElement("option");
    createOption.value = type;
    createOption.innerText = type;
    selectVoteType.append(createOption);
  });

  selectVoteType.addEventListener("change", function (event) {
    event.stopImmediatePropagation();
    event.preventDefault();
    resetVoteOptions();
    getVoteTypeOptions((event.target as HTMLOptionElement).value);
  });
}

function resetVoteOptions() {
  voteTypeOpts = {} as vote;

  var list = formVoteOption.querySelectorAll("li");
  if (list.length > 0) {
    list.forEach((t) => t.remove());
  }
}

function resetVoteType() {
  resetVoteOptions();
  voteTypes = [] as votetypes;

  var opts = selectVoteType.querySelectorAll("option");
  opts.forEach((el, index) => {
    if (index == 0) {
      el.selected = true;
    }
    if (!el.hasAttribute("selected")) {
      el.remove();
    }
  });
}

function getVoteTypeOptions(type: string) {
  axios
    .get(`${apiUrl}getVoteOptions?type=${type}`)
    .then(function (response) {
      var opts = response.data.data.options;
      if (opts.length > 0) {
        voteTypeOpts.type = type;
        voteTypeOpts.options = opts;
        voteTypeOptsEvent();
      }
    })
    .catch(() => {
      alert("could not retrieve the vote details");
    });
}

function voteTypeOptsEvent() {
  createOptionsElement();

  voteTypeOptionsListElement.addEventListener("click", ($event) => {
    $event.preventDefault();
    $event.stopPropagation();
    voteTypeChangeEventHandler($event);
  });

  changeDisplayBehaviourElements([formSubmitVoteOptionButtonElement], "remove");

  formSubmitVoteOptionButtonElement.addEventListener("click", ($event) => {
    $event.preventDefault();
    $event.stopPropagation();
    sendUserVoteOptRequest();
  });
}

function createOptionsElement() {
  voteTypeOpts.options.forEach((opt) => {
    var createOption = document.createElement("li");
    createOption.classList.add("list-group-item");
    createOption.id = opt.id;
    createOption.innerText = opt.name;
    voteTypeOptionsListElement.append(createOption);
  });
}

function voteTypeChangeEventHandler($event) {
  var element = $event.target as HTMLLIElement;
  element.classList.add("active");
  setUserSelectedValue(Number(element.id));
  Array.from(voteTypeOptionsListElement.children).forEach((t) => {
    if (t.id != element.id) {
      t.classList.remove("active");
    }
  });
  checkButtonDisableEvent();
}

function sendUserVoteOptRequest() {
  axios
    .post(
      `${apiUrl}voteForOption`,
      {
        type: voteTypeOpts.type,
        id: getUserSelectedValue(),
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    )
    .then(function (res) {
      if (res.status == 201) {
        let selectedTeam = voteTypeOpts.options.find(
          (team) => team.id == selectedValue
        ).name;
        displayVoteMessage(`You voted for ${selectedTeam}`, formVoteOption);
        changeDisplayBehaviourElements([formVoteOption], "add");
      }
    })
    .catch(() => alert("There is problem occured on server side, cant vote!"));
}

function checkButtonDisableEvent() {
  if (getUserSelectedValue() != undefined) {
    formSubmitVoteOptionButtonElement.classList.remove("disabled");
  }
}

function createNewOption() {
  var opt = document.querySelectorAll(".option");
  if (opt.length >= 5) {
    alert("Cant insert more than 5 options");
    return;
  }
  const clone = opt[0].cloneNode(true) as Element;
  var optCount = (
    Number(opt[opt.length - 1].getAttribute("id")) + 1
  ).toString();
  var input = clone.firstElementChild as HTMLInputElement;
  input.value = "";
  clone.setAttribute("id", optCount);
  input.setAttribute("placeholder", "Option detail");

  var createRemoveIcon = document.createElement("i");
  createRemoveIcon.classList.add("addBtn", "bi", "bi-trash3");
  createRemoveIcon.style.position = "absolute";
  createRemoveIcon.style.right = "25px";
  clone.insertBefore(createRemoveIcon, input);

  createRemoveIcon.addEventListener("click", () => {
    createRemoveIcon.parentElement.remove();
  });

  optsElement.appendChild(clone);
}

function submitCreateFormEvent() {
  var obj: vote = {} as vote;
  obj.options = [];

  for (const [index, input] of formCreateElement
    .querySelectorAll(".form-control")
    .entries()) {
    var inputElement = input as HTMLInputElement;
    if (index == 0) {
      obj.type = inputElement.value != "" ? inputElement.value : null;
    } else {
      if (inputElement.value != "") {
        obj.options.push({
          name: inputElement.value,
          vote: 0,
        });
      } else {
        alert("Fill form correctly");
        obj = null;
        break;
      }
    }
  }

  if (obj != null && validateCreateVote(obj)) createVoteRequest(obj);
}

function validateCreateVote(obj: vote): boolean {
  if (obj.type == null) {
    alert("Please provide vote type name");
    return false;
  }
  if (voteTypes.some((el) => el === obj.type)) {
    alert("Please write another vote type name this is already taken!");
    return false;
  }
  if (obj.options.length < 2) {
    alert("At least 2 options should be!");
    return false;
  }
  if (
    obj.options.filter(
      (v, i) =>
        obj.options.filter(
          (y, index) => JSON.stringify(y) === JSON.stringify(v) && i != index
        ).length > 0
    ).length > 0
  ) {
    alert("Options could not be same!");
    return false;
  }
  return true;
}

function createVoteRequest(req: vote) {
  axios
    .post(`${apiUrl}createVote`, req, {
      headers: { "Content-Type": "application/json" },
    })
    .then(function (res) {
      if (res.status == 201) {
        changeDisplayBehaviourElements([formCreateElement], "add");
        displayVoteMessage("Created Vote Successfuly", formCreateElement);
        resetVoteType();
        getVoteTypes();
      }
    })
    .catch((err) =>
      alert("There is problem occured on server try later again!")
    );
}

function displayVoteMessage(content, alignItemWith: Element) {
  var msg = document.createElement("h3");
  var result = document.createElement("div");
  msg.style.textAlign = "center";
  msg.innerText = content;
  result.appendChild(msg);
  alignItemWith.after(result);
}

let getUserSelectedValue = (): string | undefined => selectedValue;

let setUserSelectedValue = (value): string => (selectedValue = value);
