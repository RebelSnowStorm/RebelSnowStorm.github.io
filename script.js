// Variables
let currentSection = "boot";
let menuItems = document.querySelectorAll(".menu-item");
let selectedMenuIndex = 0;
let selectedProject = null;
let startTime = Date.now();

// Boot Animation
const bootSequenceText = [
    "Initializing BIOS v3.13...",
    "Checking NVRAM... OK",
    "Memory Test: 32768M RAM System... OK",
    "Loading Hardware Abstraction Layer...",
    "Mounting VFS Subsystems...",
    "Initializing WAREZ Server... SUCCESS",
    "Starting network daemon... [WARN: SMTP 503 Unreachable]",
    "Loading User Profile: DANIEL SOWA...",
    "Entering interactive mode..."
];

function runBootSequence()
{
    const bootSectionElement = document.getElementById("boot-sequence");
    let currentLine = 0;

    function displayNextLine() {
        if (currentLine < bootSequenceText.length) {
            const line = document.createElement("div");
            line.textContent = bootSequenceText[currentLine];
            bootSectionElement.appendChild(line);
            currentLine++;
            const randomDelay = Math.floor(Math.random() * 650) + 50;
            setTimeout(displayNextLine, randomDelay);
        }
        else {
            setTimeout(() => {
                navigateToSection("menu-section", true, true);
            }, 1000);
        }
    }

    displayNextLine();
}


// Section Navigation
function navigateToSection(sectionID, saveToHistory = true, replaceHistory = false)
{
    const targetSection = document.getElementById(sectionID);

    if (!targetSection)
    {
        return;
    }

    document.querySelectorAll("section").forEach(section => {
        section.classList.remove("active");
    });

    targetSection.classList.add("active");
    currentSection = sectionID;

    // Shoutout to _nullreferenceexception_ for adding the ability to track the visible section in the URL
    // Made the site way more user friendly, and stops the issue of exiting the site when trying to go back
    // Thanks browski <3

    if (saveToHistory)
    {
        const state = { sectionID };
        const url = `#${sectionID}`;

        if (replaceHistory)
        {
            window.history.replaceState(state, "", url);
        }
        else if (window.history.state?.sectionID !== sectionID)
        {
            window.history.pushState(state, "", url);
        }
    }
}

function setSelectedMenuIndex(index)
{
    selectedMenuIndex = index;
    
    menuItems.forEach((item, i) => {
        item.classList.toggle("active", i === index);
    });
}

// Menu Controls
function initMainMenu()
{
    initClickControls();
    initKeyboardControls();
}

function initClickControls()
{
    menuItems.forEach((item, index) => {
        item.addEventListener("click", () => {
            const section = item.dataset.section;
            navigateToSection(section);
        });

        item.addEventListener("mouseenter", () => {
            setSelectedMenuIndex(index);
        });
    });
}

function initKeyboardControls()
{
    document.addEventListener("keydown", (e) => {
        
        if (e.key === "Escape")
        {
            if (currentSection !== "boot-section" && currentSection !== "menu-section")
            {
                navigateToSection("menu-section")
            }

            return;
        }

        if (currentSection !== "menu-section") return;
        
        console.log(e.key);

        switch (e.key)
        {
            
            case "ArrowDown":
                e.preventDefault();
                selectedMenuIndex = (selectedMenuIndex + 1) % menuItems.length;
                setSelectedMenuIndex(selectedMenuIndex);
                break;

            case "ArrowUp":
                e.preventDefault();
                selectedMenuIndex = (selectedMenuIndex - 1 + menuItems.length) % menuItems.length;
                setSelectedMenuIndex(selectedMenuIndex);
                break;

            case "Enter":
                e.preventDefault();
                navigateToSection(menuItems[selectedMenuIndex].dataset.section);
                break;

            case "1": 
            case "2": 
            case "3": 
            case "4":
                const index = parseInt(e.key) - 1;
                if (menuItems[index])
                {
                    navigateToSection(menuItems[index].dataset.section);
                }
                break;
        }
    });
}

// Initialization
initMainMenu();

window.addEventListener("popstate", (event) => {
    const sectionID = event.state?.sectionID || window.location.hash.slice(1) || "menu-section";
    navigateToSection(sectionID, false);
});

const initialSection = window.location.hash.slice(1);

if (initialSection && initialSection !== "boot-section" && document.getElementById(initialSection))
{
    navigateToSection(initialSection, true, true);
}
else
{
    navigateToSection("boot-section", true, true);
    runBootSequence();
}
