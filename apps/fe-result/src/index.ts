import axios from "axios";
import { votetypes } from "./model/voteDTOs";
import { apiUrl } from "./constant/apiUrl";

var displayVoteElement = document.querySelector("#display-vote");
var emptyListMsg = document.querySelector("#empty-list-msg");
var listElement = displayVoteElement.querySelector("ul");
var collapseElement = displayVoteElement.querySelector(".collapse");
var voteTypes: votetypes = [] as votetypes;
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
        changeDisplayBehaviourElements(displayVoteElement, "remove");
      }
    })
    .catch(() => {
      changeDisplayBehaviourElements(emptyListMsg, "remove");
    });
}

function changeDisplayBehaviourElements(element: Element, display: string) {
  if (display == "add") {
    element.classList.add("hidden");
  } else {
    element.classList.remove("hidden");
  }
}

function fillVoteTypes(types: votetypes) {
  types.forEach((element) => {
    voteTypes.push(element);
  });
}

function InitilizateSelectItemsForVoteType() {
  voteTypes.forEach((type) => {
    var createOption = document.createElement("li");
    var a = document.createElement("a");
    var button = document.createElement("button");
    a.href = "#result";
    button.innerText = type;
    createOption.classList.add("p-2", "flex-auto");
    button.classList.add("btn", "btn-primary");
    button.id = type;
    a.append(button);
    button.addEventListener("click", ($event) =>
      getVoteTypeResult(($event.target as HTMLElement).id)
    );
    createOption.append(a);
    listElement.append(createOption);
  });
}

function getVoteTypeResult(type: string) {
  axios
    .get(`${apiUrl}getVoteResult?type=${type}`, {
      headers: { "Content-Type": "application/json" },
    })
    .then((res) => {
      displayVoteResult(res.data.data.options);
    });
}

function displayVoteResult(options: any[]) {
  var msgToShow: string = `</br><b>Vote result showing for "${options[0].type}" </b></br></br>`;

  options.forEach((opt) => {
    msgToShow += `Option for <b> ${opt.name} voted ${opt.vote}</b> times and total percantage over all element <b>${opt.result}%</b>`;
    msgToShow += "</br><br>";
  });

  collapseElement.innerHTML = msgToShow;
}
