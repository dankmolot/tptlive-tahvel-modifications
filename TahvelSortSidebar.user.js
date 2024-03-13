// ==UserScript==
// @name         Sort sidebar for tahvel.edu.ee
// @namespace    http://tampermonkey.net/
// @version      2024-02-28
// @description  Only leaves important links, and others sorts to Others category
// @author       Retro
// @match        https://tahvel.edu.ee/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tahvel.edu.ee
// @grant        none
// ==/UserScript==

function hook(scope, original, after) {
    return function() {
        original.apply(scope, arguments)
        try {
            after.apply(scope, arguments)
        } catch(e) {
            console.error(e)
        }
    }
}

const FAVORITE_SECTIONS = new Set([
    "main.menu.timetableLink.label",
    "main.menu.myStudyInformation.journal",
    "main.menu.homework.label"
])

let $injector = angular.element(document.getElementsByTagName("body")).injector()
let Menu = $injector.get("Menu")

Menu.setMenu = hook(Menu, Menu.setMenu, function() {
    // Sort sections
    let sections = Menu.sections.reduce((obj, v) => {
        let category = "other"
        if (FAVORITE_SECTIONS.has(v.name)) { category = "favorite" }
        if (v.type == "toggle") { category = "toggle" }

        obj[category] = obj[category] || []
        obj[category].push(v)
        return obj
    }, {})

    sections.other = sections.other.concat(sections.toggle.reduce((o, v) => o.concat(v.pages), []))

    Menu.sections = [
        ...sections.favorite,
        {
            "name": "Muu",
            "icon": "list",
            "type": "toggle",
            "pages": sections.other
        },
        // ...sections.toggle
    ]
})
