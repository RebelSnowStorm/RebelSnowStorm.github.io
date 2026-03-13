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
                navigateToSection("menu-section");
            }, 1000);
        }
    }

    displayNextLine();
}


// Section Navigation
function navigateToSection(sectionID)
{
    document.querySelectorAll("section").forEach(section => {
        section.classList.remove("active");
    });

    const targetSection = document.getElementById(sectionID);

    if (targetSection)
    {
        targetSection.classList.add("active");
        currentSection = sectionID;
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

        // 2. Early Return Guard: If we aren't in the menu, ignore all other keys
        if (currentSection !== "menu-section") return;
        
        console.log(e.key);

        // 3. Handle specific menu keys cleanly
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

navigateToSection("boot-section");

runBootSequence();