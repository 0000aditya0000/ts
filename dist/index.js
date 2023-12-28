"use strict";
const getUsername = document.querySelector("#user");
const formSubmit = document.querySelector("#form");
const main_container = document.querySelector(".main_container");
const loader = document.getElementById("load");
// reusable function
async function myCustomFetcher(url, options) {
    const response = await fetch(url, options);
    if (!response.ok) {
        throw new Error(` Network response was not ok - status: ${response.status}`);
    }
    const data = await response.json();
    //   console.log(data);
    return data;
}
// let display the card UI
const showResultUI = (singleUser) => {
    const { avatar_url, login, url } = singleUser;
    main_container.insertAdjacentHTML("beforeend", `<div class='card'> 
    <img src=${avatar_url} alt=${login} />
    <hr />
    <div class="card-footer">
      <img src="${avatar_url}" alt="${login}" /> 
      <a href="${url}"> Github </a>
    </div>
    </div>
    `);
};
function fetchUserData(url) {
    myCustomFetcher(url, {}).then((userInfo) => {
        for (const singleUser of userInfo) {
            showResultUI(singleUser);
            console.log("login " + singleUser.login);
        }
    });
}
// default function call
fetchUserData("https://api.github.com/users");
// let perform search function
formSubmit.addEventListener("submit", async (e) => {
    loader.style.display = "block";
    main_container.style.display = "none";
    e.preventDefault();
    const searchTerm = getUsername.value.toLowerCase();
    try {
        const url = "https://api.github.com/users";
        const allUserData = await myCustomFetcher(url, {});
        const matchingUsers = allUserData.filter((user) => {
            return user.login.toLowerCase().includes(searchTerm);
        });
        // we need to clear the previous data
        main_container.innerHTML = "";
        if (matchingUsers.length === 0) {
            main_container?.insertAdjacentHTML("beforeend", `<p class="empty-msg">No matching users found.</p>`);
        }
        else {
            for (const singleUser of matchingUsers) {
                showResultUI(singleUser);
            }
        }
        loader.style.display = "none";
        main_container.style.display = "flex";
    }
    catch (error) {
        console.log(error);
    }
});
