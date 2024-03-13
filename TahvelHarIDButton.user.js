// ==UserScript==
// @name         Add HarID login button
// @namespace    http://tampermonkey.net/
// @version      2024-02-23
// @description  Adds HarID button on homepage to login
// @author       Retro
// @match        https://tahvel.edu.ee/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tahvel.edu.ee
// @grant        GM_addStyle
// ==/UserScript==

// Shared
function parseHTML(html) {
    var t = document.createElement('template');
    t.innerHTML = html;
    return t.content;
}

function onClassChange(element, callback) {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (
        mutation.type === 'attributes' &&
        mutation.attributeName === 'class'
      ) {
        callback(mutation.target);
      }
    });
  });
  observer.observe(element, { attributes: true });
  return observer.disconnect;
}

// Add HarID login button
let loginNavBar = document.querySelector("div[ng-controller='LoginController']")

GM_addStyle(`
#harid-login {
    background: var(--base-color-blue);
    border-radius: .5rem;
    margin-left: 1em;
    color: white;
    text-decoration: none;
    font-weight: 700;
    font-size: 20px;
}
`)

let loginButton = parseHTML(`
    <a id="harid-login" class="md-button mk-ink-ripple" href="https://tahvel.edu.ee/hois_back/haridLogin">HarID</>
`)

loginNavBar.append(loginButton)

onClassChange(document.querySelector("div[ng-show='!state.currentUser']"), function(el) {
    let hidden = el.classList.contains("ng-hide")
    let loginButton = document.getElementById("harid-login")
    if (hidden) {
        loginButton.classList.add("ng-hide")
    } else {
        loginButton.classList.remove("ng-hide")
    }
})
