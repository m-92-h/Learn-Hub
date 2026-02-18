// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
    // DOM Elements - ONLY SELECTING THE MAIN CONTAINER
    const contentArea = document.querySelector(".content-area");
    const sidebarNav = document.getElementById("sidebar-nav");

    // Store the current topic and section data
    let currentTopic = null;
    let topicLinks = [];

    // Quiz State Variables
    let userAnswers = {};
    let currentQuiz = null;
    let currentQuestionIndex = 0;

    // Show error message
    function showError(message) {
        console.error(message);
        if (contentArea) {
            // FIX 1: Using textContent for error message to prevent XSS risk
            contentArea.innerHTML = `
                <div class="p-6 text-red-500">
                    <p class="font-bold">Error Loading Content:</p>
                    <p id="error-message-text"></p>
                    <p class="mt-2">Please check the console for more details</p>
                </div>
            `;
            document.getElementById("error-message-text").textContent = message;
        }
    }

    // Function to get URL query parameters
    function getUrlParameter(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
        var results = regex.exec(location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }

    // Function to start a specific quiz
    function startQuiz(quizKey) {
        if (quizzesData[quizKey]) {
            currentQuiz = quizzesData[quizKey];
            currentQuestionIndex = 0;
            userAnswers = {};

            // FIX 2: Call setupQuiz directly instead of relying on a missing 'renderQuiz' function.
            // We assume that the first section/topic with 'isQuiz: true' loads the quiz.
            // We need to find the specific sectionNumber and topicNumber for this quizKey.
            let sectionNumber = 0;
            let topicNumber = 0;

            for (let i = 0; i < sectionsData.sections.length; i++) {
                for (let j = 0; j < sectionsData.sections[i].topics.length; j++) {
                    const topic = sectionsData.sections[i].topics[j];
                    if (topic.isQuiz && topic.quizId === quizKey) {
                        sectionNumber = i + 1;
                        topicNumber = j + 1;
                        break;
                    }
                }
                if (sectionNumber > 0) break;
            }

            if (sectionNumber > 0 && topicNumber > 0) {
                setupQuiz(quizKey, sectionNumber, topicNumber);
            } else {
                showError(`Quiz data found for key: ${quizKey}, but corresponding topic link (section/topic) was not found in sectionsData. Loading default topic (1, 1) instead.`);
                loadTopic(1, 1);
            }
        } else {
            showError(`Quiz data not found for key: ${quizKey}. Loading default topic (1, 1) instead.`);
            // Fallback to loading the first topic if the quiz key is invalid
            loadTopic(1, 1);
        }
    }

    // Quiz Data for Course Sections
    const quizzesData = {
        data_science_section: {
            title: "Data Science Fundamentals Quiz",
            questions: [
                {
                    question: "Which Python library is primarily used for numerical operations and working with arrays?",
                    options: ["Pandas", "NumPy", "Matplotlib", "Scikit-learn"],
                    correctAnswer: "NumPy",
                },
                {
                    question: "What is the first step in the data science workflow?",
                    options: ["Model Building", "Data Collection", "Data Visualization", "Model Deployment"],
                    correctAnswer: "Data Collection",
                },
                {
                    question: "Which machine learning type involves training data with labeled outputs?",
                    options: ["Unsupervised Learning", "Supervised Learning", "Reinforcement Learning", "Semi-supervised Learning"],
                    correctAnswer: "Supervised Learning",
                },
            ],
        },
        cybersecurity_section: {
            title: "Cybersecurity Essentials Quiz",
            questions: [
                {
                    question: "What is the primary goal of a DDoS attack?",
                    options: ["Data Theft", "Service Disruption", "Unauthorized Access", "Malware Installation"],
                    correctAnswer: "Service Disruption",
                },
                {
                    question: "Which of the following is NOT part of the CIA triad in cybersecurity?",
                    options: ["Confidentiality", "Integrity", "Availability", "Authentication"],
                    correctAnswer: "Authentication",
                },
                {
                    question: "What does the 'S' stand for in HTTPS?",
                    options: ["Secure", "System", "Server", "Standard"],
                    correctAnswer: "Secure",
                },
            ],
        },
        cloud_computing_section: {
            title: "Cloud Computing & DevOps Quiz",
            questions: [
                {
                    question: "Which cloud service model provides virtualized computing resources over the internet?",
                    options: ["IaaS", "PaaS", "SaaS", "FaaS"],
                    correctAnswer: "IaaS",
                },
                {
                    question: "What is the main purpose of containerization?",
                    options: ["To increase storage capacity", "To create isolated environments for applications", "To improve internet speed", "To enhance graphics performance"],
                    correctAnswer: "To create isolated environments for applications",
                },
                {
                    question: "Which AWS service provides object storage?",
                    options: ["EC2", "S3", "Lambda", "RDS"],
                    correctAnswer: "S3",
                },
            ],
        },
    };

    // Sections Data (Updated for Data Science, Cybersecurity, and Cloud Computing)
    const sectionsData = {
        sections: [
            {
                id: "data_science_section",
                title: "Data Science Fundamentals",
                topics: [
                    {
                        id: "ds-1",
                        title: "Introduction to Data Science",
                        content: "Explore the fundamentals of data science, its importance in today's world, and the data science lifecycle. Learn about key concepts like data collection, cleaning, analysis, and visualization.",
                        imageUrl: "",
                    },
                    {
                        id: "ds-2",
                        title: "Python for Data Science",
                        content: "Master essential Python libraries for data science including NumPy, Pandas, and Matplotlib. Learn data manipulation, cleaning, and basic visualization techniques.",
                        imageUrl: "",
                    },
                    {
                        id: "ds-3",
                        title: "Data Analysis with Pandas",
                        content: "Dive deep into data analysis using Pandas. Learn about DataFrames, Series, and how to perform complex data operations and transformations.",
                        imageUrl: "",
                    },
                    {
                        id: "ds-4",
                        title: "Data Visualization",
                        content: "Create compelling visualizations using Matplotlib and Seaborn. Learn to tell stories with data through various chart types and customization options.",
                        imageUrl: "",
                    },
                    {
                        id: "ds-5",
                        title: "Introduction to Machine Learning",
                        content: "Get started with machine learning concepts. Understand supervised vs. unsupervised learning, and implement basic algorithms using scikit-learn.",
                        imageUrl: "",
                    },
                    {
                        id: "ds-6",
                        title: "Feature Engineering",
                        content: "Learn techniques to create and select the most relevant features for your machine learning models to improve their performance.",
                        imageUrl: "",
                    },
                    {
                        id: "ds-7",
                        title: "Model Evaluation",
                        content: "Understand key metrics for evaluating machine learning models including accuracy, precision, recall, F1-score, and ROC curves.",
                        imageUrl: "",
                    },
                    {
                        id: "ds-8",
                        title: "Data Science Project Workflow",
                        content: "Learn the complete workflow of a data science project from problem definition to model deployment.",
                        imageUrl: "",
                    },
                    {
                        id: "ds-9",
                        title: "Big Data Technologies",
                        content: "Introduction to big data concepts and technologies like Hadoop and Spark for processing large datasets.",
                        imageUrl: "",
                    },
                    {
                        id: "ds-10",
                        title: "Data Science in Production",
                        content: "Learn how to deploy machine learning models and create data products using Flask/Django and cloud services.",
                        imageUrl: "",
                    },
                    {
                        id: "ds-11",
                        title: "Data Science Quiz",
                        content: "Test your knowledge in the Data Science section.",
                        isQuiz: true,
                        quizId: "data_science_section",
                    },
                ],
            },
            {
                id: "cybersecurity_section",
                title: "Cybersecurity Essentials",
                topics: [
                    {
                        id: "cs-1",
                        title: "Introduction to Cybersecurity",
                        content: "Understand the cybersecurity landscape, common threats, and the importance of information security in the digital age.",
                        imageUrl: "",
                    },
                    {
                        id: "cs-2",
                        title: "Network Security Fundamentals",
                        content: "Learn about network security principles, protocols, and best practices for securing network infrastructure.",
                        imageUrl: "",
                    },
                    {
                        id: "cs-3",
                        title: "Encryption and Cryptography",
                        content: "Explore encryption algorithms, public key infrastructure (PKI), and cryptographic protocols used to secure data in transit and at rest.",
                        imageUrl: "",
                    },
                    {
                        id: "cs-4",
                        title: "Web Application Security",
                        content: "Learn about common web vulnerabilities (OWASP Top 10) and how to secure web applications against attacks.",
                        imageUrl: "",
                    },
                    {
                        id: "cs-5",
                        title: "Ethical Hacking Basics",
                        content: "Introduction to ethical hacking methodologies, tools, and techniques used to identify and fix security vulnerabilities.",
                        imageUrl: "",
                    },
                    {
                        id: "cs-6",
                        title: "Incident Response",
                        content: "Learn how to detect, respond to, and recover from security incidents effectively.",
                        imageUrl: "",
                    },
                    {
                        id: "cs-7",
                        title: "Security Compliance and Standards",
                        content: "Understand major security standards like ISO 27001, NIST, and GDPR, and how to implement security controls.",
                        imageUrl: "",
                    },
                    {
                        id: "cs-8",
                        title: "Cloud Security",
                        content: "Security considerations and best practices for cloud computing environments.",
                        imageUrl: "",
                    },
                    {
                        id: "cs-9",
                        title: "Mobile Security",
                        content: "Security challenges and solutions for mobile applications and devices.",
                        imageUrl: "",
                    },
                    {
                        id: "cs-10",
                        title: "Cybersecurity Career Paths",
                        content: "Explore different career opportunities in cybersecurity and the skills required for each role.",
                        imageUrl: "",
                    },
                    {
                        id: "cs-11",
                        title: "Cybersecurity Quiz",
                        content: "Test your knowledge in the Cybersecurity section.",
                        isQuiz: true,
                        quizId: "cybersecurity_section",
                    },
                ],
            },
            {
                id: "cloud_computing_section",
                title: "Cloud Computing & DevOps",
                topics: [
                    {
                        id: "cc-1",
                        title: "Introduction to Cloud Computing",
                        content: "Understand cloud computing concepts, service models (IaaS, PaaS, SaaS), and deployment models (public, private, hybrid).",
                        imageUrl: "",
                    },
                    {
                        id: "cc-2",
                        title: "AWS Fundamentals",
                        content: "Get started with Amazon Web Services (AWS), including EC2, S3, and other core services for building cloud applications.",
                        imageUrl: "",
                    },
                    {
                        id: "cc-3",
                        title: "Microsoft Azure Basics",
                        content: "Introduction to Microsoft's cloud platform, including virtual machines, app services, and Azure Active Directory.",
                        imageUrl: "",
                    },
                    {
                        id: "cc-4",
                        title: "Google Cloud Platform (GCP)",
                        content: "Learn about Google's cloud offerings including Compute Engine, Cloud Storage, and BigQuery.",
                        imageUrl: "",
                    },
                    {
                        id: "cc-5",
                        title: "Containerization with Docker",
                        content: "Master containerization concepts and learn to build, ship, and run applications using Docker.",
                        imageUrl: "",
                    },
                    {
                        id: "cc-6",
                        title: "Orchestration with Kubernetes",
                        content: "Learn to deploy, scale, and manage containerized applications using Kubernetes.",
                        imageUrl: "",
                    },
                    {
                        id: "cc-7",
                        title: "Infrastructure as Code (IaC)",
                        content: "Automate infrastructure provisioning and management using tools like Terraform and AWS CloudFormation.",
                        imageUrl: "",
                    },
                    {
                        id: "cc-8",
                        title: "CI/CD Pipelines",
                        content: "Implement continuous integration and continuous deployment using tools like Jenkins, GitHub Actions, or GitLab CI.",
                        imageUrl: "",
                    },
                    {
                        id: "cc-9",
                        title: "Cloud Security Best Practices",
                        content: "Learn essential security practices for cloud environments and compliance requirements.",
                        imageUrl: "",
                    },
                    {
                        id: "cc-10",
                        title: "Serverless Computing",
                        content: "Explore serverless architectures using AWS Lambda, Azure Functions, or Google Cloud Functions.",
                        imageUrl: "",
                    },
                    {
                        id: "cc-11",
                        title: "Cloud Computing Quiz",
                        content: "Test your knowledge in the Cloud Computing section.",
                        isQuiz: true,
                        quizId: "cloud_computing_section",
                    },
                ],
            },
        ],
    };

    // Load a specific topic (CORRECTED)
    function loadTopic(sectionNumber, topicNumber) {
        try {
            const section = sectionsData.sections[sectionNumber - 1];
            if (!section) {
                throw new Error("Section not found");
            }

            const topic = section.topics[topicNumber - 1];
            if (!topic) {
                throw new Error("Topic not found");
            }

            currentTopic = { sectionNumber, topicNumber };

            // Check for Quiz
            if (topic.isQuiz) {
                setupQuiz(topic.quizId, sectionNumber, topicNumber);
                updateActiveLink(sectionNumber, topicNumber);
                return;
            }

            // 1. Rebuild the entire contentArea for a standard topic (FIX: Ensures h1, h2, and nav buttons are present)
            contentArea.innerHTML = `
                <h1 class="text-xl md:text-3xl font-bold mb-6">
                    <span id="section-number-title"></span> 
                    <span id="section-title" class="text-blue-700"></span>
                </h1>
                
                <h2 class="text-lg md:text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6 border-b pb-2">
                    <span id="topic-number-title"></span>
                    <span id="topic-title"></span>
                </h2>
                
                <div class="prose dark:prose-invert text-md max-w-none mb-8">
                    <p class="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed" id="topic-content"></p>
                </div>
                
                <div class="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mb-8 flex items-center justify-center min-h-48">
                    ${
                        topic.imageUrl
                            ? `<img src="${topic.imageUrl}" alt="${topic.title}" class="max-w-full h-auto rounded">`
                            : `
                        <div class="text-center">
                            <i class="fas fa-image text-5xl text-gray-400 mb-2"></i>
                            <p class="text-gray-500 dark:text-gray-400">No image available</p>
                        </div>
                    `
                    }
                </div>
                
                <div class="flex flex-nowrap items-center justify-between gap-2 pt-6 border-t border-gray-200 dark:border-gray-700 pb-2">
                    <button id="prev-topic" class="flex items-center px-2.5 md:px-5 py-1.5 md:py-2.5 border border-blue-200 dark:border-blue-800 rounded-lg bg-text-DEFAULT dark:bg-gray-800 text-primary-dark dark:text-primary-light hover:bg-blue-50 dark:hover:bg-border-darker transition-all duration-300 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                        <i class="fas fa-arrow-left mr-1 sm:mr-2 text-xs sm:text-sm"></i>
                        <span class="whitespace-nowrap">Previous</span>
                    </button>
                    <div class="text-xs sm:text-sm px-2 text-center sm:whitespace-nowrap" id="topic-nav-display"></div>
                    <button id="next-topic" class="flex items-center px-2.5 md:px-5 py-1.5 md:py-2.5 border border-blue-200 dark:border-blue-800 rounded-lg bg-text-DEFAULT dark:bg-gray-800 text-primary-dark dark:text-primary-light hover:bg-blue-50 dark:hover:bg-border-darker transition-all duration-300 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                        <span class="whitespace-nowrap">Next</span>
                        <i class="fas fa-arrow-right ml-1 sm:ml-2 text-xs sm:text-sm"></i>
                    </button>
                </div>
            `;

            // FIX 3: Update text content using textContent for safety
            document.getElementById("section-number-title").textContent = `Section ${sectionNumber}:`;
            document.getElementById("section-title").textContent = section.title;
            document.getElementById("topic-number-title").textContent = `Topic ${sectionNumber}-${topicNumber}:`;
            document.getElementById("topic-title").textContent = topic.title;
            document.getElementById("topic-content").textContent = topic.content || "No content available";
            document.getElementById("topic-nav-display").textContent = `Section ${sectionNumber} - Topic ${topicNumber}`;

            // 2. Re-fetch buttons after DOM replacement (FIX: Correct element reference)
            const newPrevButton = document.getElementById("prev-topic");
            const newNextButton = document.getElementById("next-topic");

            // 3. Update navigation buttons
            updateNavigationButtons(sectionNumber, topicNumber, false, newPrevButton, newNextButton);
            // 4. Update active link in sidebar
            updateActiveLink(sectionNumber, topicNumber);
        } catch (error) {
            showError(error.message);
        }
    }

    // Update navigation buttons state (CORRECTED signature to accept buttons)
    function updateNavigationButtons(sectionNumber, topicNumber, isQuiz = false, prevBtn, nextBtn) {
        if (!prevBtn || !nextBtn) return;

        if (isQuiz) return;

        const section = sectionsData.sections[sectionNumber - 1];
        if (!section) return;

        const totalSections = sectionsData.sections.length;
        const isFirstTopic = topicNumber === 1 && sectionNumber === 1;
        const isLastTopic = topicNumber === section.topics.length && sectionNumber === totalSections;

        // Previous button
        prevBtn.disabled = isFirstTopic;
        prevBtn.classList.toggle("opacity-50", isFirstTopic);
        prevBtn.classList.toggle("cursor-not-allowed", isFirstTopic);

        // Clone buttons to remove old event listeners
        const newPrevBtn = prevBtn.cloneNode(true);
        const newNextBtn = nextBtn.cloneNode(true);

        prevBtn.parentNode.replaceChild(newPrevBtn, prevBtn);
        nextBtn.parentNode.replaceChild(newNextBtn, nextBtn);

        // Add new event listeners.
        newPrevBtn.addEventListener("click", () => {
            if (topicNumber > 1) {
                loadTopic(sectionNumber, topicNumber - 1);
            } else if (sectionNumber > 1) {
                // Load the last topic of the previous section
                loadTopic(sectionNumber - 1, sectionsData.sections[sectionNumber - 2].topics.length);
            }
        });

        // REMOVED: Separate 'touchend' listeners as modern browsers handle 'click' on touch devices.
        // The original logic is preserved for functionality, though slightly redundant.
        newPrevBtn.addEventListener("touchend", (e) => {
            e.preventDefault();
            newPrevBtn.click();
        });

        // Next button
        newNextBtn.disabled = isLastTopic;
        newNextBtn.classList.toggle("opacity-50", isLastTopic);
        newNextBtn.classList.toggle("cursor-not-allowed", isLastTopic);

        newNextBtn.addEventListener("click", () => {
            if (topicNumber < section.topics.length) {
                loadTopic(sectionNumber, topicNumber + 1);
            } else if (sectionNumber < totalSections) {
                // Load the first topic of the next section
                loadTopic(sectionNumber + 1, 1);
            }
        });

        // REMOVED: Separate 'touchend' listeners as modern browsers handle 'click' on touch devices.
        // The original logic is preserved for functionality, though slightly redundant.
        newNextBtn.addEventListener("touchend", (e) => {
            e.preventDefault();
            newNextBtn.click();
        });

        // Update URL without page reload
        const newUrl = `${window.location.pathname}?section=${sectionNumber}&topic=${topicNumber}`;
        window.history.pushState({ section: sectionNumber, topic: topicNumber }, "", newUrl);
    }

    // Update active link in sidebar
    function updateActiveLink(sectionNumber, topicNumber) {
        topicLinks.forEach((link) => {
            // Use data attributes for comparison
            const linkSection = parseInt(link.dataset.section);
            const linkTopic = parseInt(link.dataset.topic);

            // Remove all active and quiz-specific classes
            link.classList.remove("text-blue-600", "font-medium", "bg-blue-100/50", "dark:bg-gray-700/50", "text-red-500", "dark:text-red-400");

            // Add default classes
            link.classList.add("text-gray-600", "dark:text-gray-300");

            // Activate current link
            if (linkSection === sectionNumber && linkTopic === topicNumber) {
                link.classList.add("text-blue-600", "font-medium", "bg-blue-100/50", "dark:bg-gray-700/50");
                link.classList.remove("text-gray-600", "dark:text-gray-300");
                link.scrollIntoView({ behavior: "smooth", block: "nearest" });
            }
            // Apply quiz color to non-active quiz links
            else {
                const section = sectionsData.sections[linkSection - 1];
                const topic = section.topics[linkTopic - 1];
                if (topic && topic.isQuiz) {
                    link.classList.add("text-red-500", "dark:text-red-400");
                    link.classList.remove("text-gray-600", "dark:text-gray-300");
                }
            }
        });
    }

    // Generate sidebar navigation (Remains the same)
    function generateSidebar() {
        if (!sidebarNav) return;

        // Clear loading indicator
        sidebarNav.innerHTML = "";
        topicLinks = []; // Reset links

        sectionsData.sections.forEach((section, sectionIndex) => {
            const sectionNumber = sectionIndex + 1;
            const sectionDiv = document.createElement("div");

            // Create section header
            const sectionHeader = document.createElement("div");
            sectionHeader.className = "px-4 py-2 font-bold text-blue-600 text-xl";
            sectionHeader.textContent = section.title;
            sectionDiv.appendChild(sectionHeader);

            // Create topics list
            const topicsList = document.createElement("ul");
            topicsList.className = "pl-6 mt-1 space-y-1 text-sm";

            section.topics.forEach((topic, topicIndex) => {
                const topicNumber = topicIndex + 1;
                const listItem = document.createElement("li");
                const link = document.createElement("a");

                link.href = "#";

                // Set style for quiz link
                link.className = topic.isQuiz ? "block py-1 text-red-500 dark:text-red-400 hover:text-red-600 font-semibold" : "block py-1 text-gray-600 dark:text-gray-300 hover:text-primary-600";

                link.dataset.section = sectionNumber;
                link.dataset.topic = topicNumber;
                link.textContent = `${sectionNumber}-${topicNumber} ${topic.title}`;

                link.addEventListener("click", (e) => {
                    e.preventDefault();
                    loadTopic(sectionNumber, topicNumber);
                });

                listItem.appendChild(link);
                topicsList.appendChild(listItem);
                topicLinks.push(link);
            });

            sectionDiv.appendChild(topicsList);
            sidebarNav.appendChild(sectionDiv);
        });
    }

    // ------------------------------------------------------------------
    // Quiz Functions
    // ------------------------------------------------------------------

    // Event handler to save the selected answer (used in renderQuestion)
    function handleAnswerChange(questionIndex, answer) {
        userAnswers[questionIndex] = answer;
        updateQuizNavigation(); // Update Next/Finish button state
    }

    // FIX 4: Expose handleAnswerChange globally ONLY because it's used in inline HTML 'onchange'.
    // In a cleaner design, event delegation would be preferred.
    window.handleAnswerChange = handleAnswerChange;

    // Setup Quiz UI and logic
    function setupQuiz(quizId, sectionNumber, topicNumber) {
        currentQuiz = quizzesData[quizId];
        // Reset answers and state for a new quiz
        userAnswers = {};
        currentQuestionIndex = 0;

        const section = sectionsData.sections[sectionNumber - 1];

        // 1. Rebuild the entire contentArea for the quiz
        contentArea.innerHTML = `
            <h1 class="text-3xl font-bold text-red-600 mb-6">
                <span class="text-blue-700">Section ${sectionNumber}:</span> ${section.title}
            </h1>
            
            <h2 class="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6 border-b pb-2">
                Topic ${sectionNumber}-${topicNumber}: ${currentQuiz.title}
            </h2>
            
            <div class="p-6">
                <div id="quiz-status" class="text-center mb-6 text-gray-600 dark:text-gray-400 font-medium text-lg"></div>
                <div id="quiz-content" class="min-h-[250px] flex flex-col justify-center"></div>
                <div id="quiz-navigation" class="flex justify-between pt-6 border-t border-gray-200 dark:border-gray-700 mt-6">
                    <button id="quiz-prev" class="flex items-center px-5 py-2.5 rounded-lg text-blue-600 dark:text-blue-400 transition-all duration-300 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed">
                        <i class="fas fa-arrow-left mr-2"></i>
                        <span>Previous</span>
                    </button>
                    <button id="quiz-next" class="flex items-center px-5 py-2.5 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-all duration-300 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed">
                        <span id="next-text">Next</span>
                        <i id="next-icon" class="fas fa-arrow-right ml-2"></i>
                    </button>
                </div>
                <div id="quiz-result" class="hidden text-center mt-8 p-6 rounded-lg bg-gray-50 dark:bg-gray-800 inset-shadow-sm inset-shadow-gray-100">
                    <h3 class="text-2xl font-bold text-green-800 dark:text-green-400 mb-4">Quiz Finished!</h3>
                    <p id="final-score" class="text-xl text-gray-700 dark:text-gray-200 mb-4"></p>
                    <button id="retake-quiz" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full transition duration-300 cursor-pointer">Retake Quiz</button>
                </div>
            </div>
        `;

        // 2. Re-fetch buttons for quiz navigation setup
        const quizPrevButton = document.getElementById("quiz-prev");
        const quizNextButton = document.getElementById("quiz-next");

        // Set up event listeners for quiz navigation
        if (quizPrevButton && quizNextButton) {
            quizPrevButton.addEventListener("click", () => {
                if (currentQuestionIndex > 0) {
                    currentQuestionIndex--;
                    renderQuestion(currentQuestionIndex);
                }
            });

            quizNextButton.addEventListener("click", () => {
                // Check if the current question is answered before moving forward
                if (userAnswers[currentQuestionIndex] !== undefined) {
                    if (currentQuestionIndex < currentQuiz.questions.length - 1) {
                        currentQuestionIndex++;
                        renderQuestion(currentQuestionIndex);
                    } else {
                        showResults();
                    }
                }
            });
        }

        const retakeQuizButton = document.getElementById("retake-quiz");
        if (retakeQuizButton) {
            retakeQuizButton.addEventListener("click", () => {
                setupQuiz(quizId, sectionNumber, topicNumber); // Reset the quiz
            });
        }

        // Update active link in sidebar
        updateActiveLink(sectionNumber, topicNumber);

        // Render the first question
        renderQuestion(currentQuestionIndex);
    }

    // Render the current question
    function renderQuestion(index) {
        const quizContent = document.getElementById("quiz-content");
        if (!quizContent || !currentQuiz) return;

        const questionData = currentQuiz.questions[index];
        const questionNumber = index + 1;
        const totalQuestions = currentQuiz.questions.length;

        // Update quiz status
        const quizStatus = document.getElementById("quiz-status");
        if (quizStatus) quizStatus.textContent = `Question ${questionNumber} of ${totalQuestions}`;

        // Question template
        // FIX 5: Use textContent for question to prevent XSS risk
        quizContent.innerHTML = `
            <div class="bg-gray-50 dark:bg-gray-700 p-5 rounded-lg shadow-md w-full max-w-2xl mx-auto">
                <p class="text-xl font-semibold mb-5 text-gray-800 dark:text-gray-100" id="current-question-text"></p>
                <div id="options-container" class="space-y-3">
                    </div>
            </div>
        `;

        document.getElementById("current-question-text").textContent = `${questionNumber}. ${questionData.question}`;

        const optionsContainer = document.getElementById("options-container");
        questionData.options.forEach((option) => {
            const isChecked = userAnswers[index] === option;
            // FIX 6: The 'onchange' handler relies on the globally exposed handleAnswerChange.
            // Option text is still safe here as it comes from the static data structure.
            const optionHtml = `
                <label class="flex items-center p-3 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-primary-50 dark:hover:bg-gray-600 transition-colors duration-200 cursor-pointer shadow-sm">
                    <input type="radio" name="question-${index}" value="${option}" ${isChecked ? "checked" : ""} 
                           class="form-radio h-4 w-4 text-green-600 dark:text-green-400 border-gray-300 dark:border-gray-500 focus:ring-green-500 cursor-pointer" 
                           onchange="handleAnswerChange(${index}, this.value)">
                    <span class="ml-3 text-gray-700 dark:text-gray-200">${option}</span>
                </label>
            `;
            // Use insertAdjacentHTML for better performance
            if (optionsContainer) optionsContainer.insertAdjacentHTML("beforeend", optionHtml);
        });

        // Hide results when viewing a question
        const resultDiv = document.getElementById("quiz-result");
        if (resultDiv) resultDiv.classList.add("hidden");

        const navDiv = document.getElementById("quiz-navigation");
        if (navDiv) navDiv.style.display = "flex";

        if (quizStatus) quizStatus.style.display = "block";

        // Update navigation buttons state
        updateQuizNavigation();
    }

    // Original save the selected answer logic (now contained in handleAnswerChange)
    // REMOVED: window.handleAnswerChange definition here, moved to the block above for clarity.

    // Update the state of quiz navigation buttons
    function updateQuizNavigation() {
        if (!currentQuiz) return;

        const prevButton = document.getElementById("quiz-prev");
        const nextButton = document.getElementById("quiz-next");
        const nextText = document.getElementById("next-text");
        const nextIcon = document.getElementById("next-icon");

        if (!prevButton || !nextButton) return;

        // Previous button
        const isFirst = currentQuestionIndex === 0;
        prevButton.disabled = isFirst;
        prevButton.classList.toggle("opacity-50", isFirst);
        prevButton.classList.toggle("cursor-not-allowed", isFirst);

        // Next/Finish button
        const isLast = currentQuestionIndex === currentQuiz.questions.length - 1;
        const isAnswered = userAnswers[currentQuestionIndex] !== undefined;

        if (isLast) {
            if (nextText) nextText.textContent = "Finish Quiz";
            if (nextIcon) nextIcon.className = "fas fa-check ml-2";
            // Enable Finish only if the last question is answered
            nextButton.disabled = !isAnswered;
            nextButton.classList.toggle("opacity-50", !isAnswered);
            nextButton.classList.toggle("cursor-not-allowed", !isAnswered);
        } else {
            if (nextText) nextText.textContent = "Next";
            if (nextIcon) nextIcon.className = "fas fa-arrow-right ml-2";
            // Enable Next only if the current question is answered
            nextButton.disabled = !isAnswered;
            nextButton.classList.toggle("opacity-50", !isAnswered);
            nextButton.classList.toggle("cursor-not-allowed", !isAnswered);
        }
    }

    // Display Final Results
    function showResults() {
        let correctCount = 0;
        currentQuiz.questions.forEach((question, index) => {
            if (userAnswers[index] === question.correctAnswer) {
                correctCount++;
            }
        });

        const totalQuestions = currentQuiz.questions.length;

        // Hide questions content and navigation
        const quizContent = document.getElementById("quiz-content");
        if (quizContent)
            quizContent.innerHTML = `
            <div class="text-center text-gray-700 dark:text-gray-200">
                <p class="text-xl">You have reached the end of the quiz. The final score will be displayed below.</p>
            </div>
        `;
        const navDiv = document.getElementById("quiz-navigation");
        if (navDiv) navDiv.style.display = "none";

        const statusDiv = document.getElementById("quiz-status");
        if (statusDiv) statusDiv.style.display = "none";

        // Show results
        const resultDiv = document.getElementById("quiz-result");
        if (resultDiv) resultDiv.classList.remove("hidden");

        let message = "";
        if (correctCount === totalQuestions) {
            message = "Congratulations! You achieved a perfect score.";
        } else if (correctCount >= totalQuestions / 2) {
            message = "Good score! You can try to improve it.";
        } else {
            message = "You can review and try again to achieve a better result.";
        }

        const finalScore = document.getElementById("final-score");
        // FIX 7: Use textContent for messages that contain dynamic data, or ensure proper sanitization/text nodes.
        if (finalScore) {
            finalScore.innerHTML = `
                <p class="text-2xl font-bold" id="result-message"></p>
                <p class="mt-2 text-xl" id="result-score-details"></p>
            `;
            document.getElementById("result-message").textContent = message;
            document.getElementById("result-score-details").textContent = `Final Score: ${correctCount} correct answer(s) out of ${totalQuestions} questions.`;
        }
    }

    // ------------------------------------------------------------------
    // New Function: Generate offcanvas menu topics and attach listeners
    function generateOffcanvasTopics() {
        // Map section IDs to their corresponding unique UL IDs in doc.html
        const offcanvasUls = {
            data_science_section: document.getElementById("dataScience-submenu"),
            cybersecurity_section: document.getElementById("cybersecurity-submenu"),
            cloud_computing_section: document.getElementById("cloudComputing-submenu"),
        };

        sectionsData.sections.forEach((section, sectionIndex) => {
            const sectionNumber = sectionIndex + 1;
            const targetUl = offcanvasUls[section.id];

            if (!targetUl) return; // Skip if the container is not found

            targetUl.innerHTML = ""; // Clear any initial content

            section.topics.forEach((topic, topicIndex) => {
                const topicNumber = topicIndex + 1;
                const listItem = document.createElement("li");
                const link = document.createElement("a");

                link.href = "#";

                // Set classes for mobile links (including hover/quiz styles)
                link.className = topic.isQuiz ? "block py-1 px-4 text-red-500 dark:text-red-400 hover:text-red-600 font-semibold text-base" : "block py-1 px-4 text-gray-700 dark:text-gray-300 hover:text-primary-600 text-base";

                link.dataset.section = sectionNumber;
                link.dataset.topic = topicNumber;
                // FIX 8: Use textContent for safety
                link.textContent = `${sectionNumber}-${topicNumber} ${topic.title}`;

                // Attach click listener for loading topic and closing menu
                link.addEventListener("click", (e) => {
                    e.preventDefault();
                    // 1. Load the topic
                    loadTopic(sectionNumber, topicNumber);

                    // 2. Close the offcanvas menu (by removing the 'open' class)
                    const offcanvasMenu = document.getElementById("offcanvasMenu");
                    const offcanvasOverlay = document.getElementById("offcanvasOverlay");
                    if (offcanvasMenu && offcanvasOverlay) {
                        offcanvasMenu.classList.remove("active");
                        offcanvasOverlay.classList.remove("active");
                    }
                });

                listItem.appendChild(link);
                targetUl.appendChild(listItem);
            });
        });
    }

    // ------------------------------------------------------------------

    // Function to link the top navbar links (Quizzes and Sections) to specific topics
    function setupNavbarLinks() {
        // 💡 Correction: Search for the correct classes used in HTML
        const allNavbarLinks = document.querySelectorAll(".quiz-nav-link, .section-link, #quizzes-submenu .quiz-nav-link");

        if (!allNavbarLinks.length || !sectionsData || !sectionsData.sections || sectionsData.sections.length < 3) {
            console.warn("Navbar links setup skipped: missing elements or sections data or insufficient sections.");
            return;
        }

        allNavbarLinks.forEach((link) => {
            link.addEventListener("click", (e) => {
                e.preventDefault();

                const sectionHref = link.getAttribute("href");
                let sectionIndex;
                let sectionNumber;
                let topicNumber = 1; // Default: first topic
                let isQuiz = false;

                // Determine the section number and required action

                // --- "Quizzes" menu links (Last topic) ---
                if (sectionHref === "#dataScienceQuiz") {
                    sectionIndex = 0;
                    sectionNumber = 1;
                    // Last topic is the length of the topics array
                    topicNumber = sectionsData.sections[sectionIndex].topics.length;
                    isQuiz = true;
                } else if (sectionHref === "#cybersecurityQuiz") {
                    sectionIndex = 1;
                    sectionNumber = 2;
                    topicNumber = sectionsData.sections[sectionIndex].topics.length;
                    isQuiz = true;
                } else if (sectionHref === "#cloudComputingQuiz") {
                    sectionIndex = 2;
                    sectionNumber = 3;
                    topicNumber = sectionsData.sections[sectionIndex].topics.length;
                    isQuiz = true;

                    // --- "Section" menu links (First topic) ---
                } else if (sectionHref === "#dataScienceCourses") {
                    sectionIndex = 0;
                    sectionNumber = 1;
                    topicNumber = 1; // First topic
                } else if (sectionHref === "#cybersecurityCourses") {
                    sectionIndex = 1;
                    sectionNumber = 2;
                    topicNumber = 1; // First topic
                } else if (sectionHref === "#cloudComputingCourses") {
                    sectionIndex = 2;
                    sectionNumber = 3;
                    topicNumber = 1; // First topic
                } else {
                    return;
                }

                // [For diagnosis] Print values sent to loadTopic for review
                console.log(`[NAV LINK CLICK] Type: ${isQuiz ? "Quiz" : "Section"}, Section: ${sectionNumber}, Topic: ${topicNumber}, Topic Index: ${topicNumber - 1}`);

                if (topicNumber > 0) {
                    // Call the topic loading function
                    loadTopic(sectionNumber, topicNumber);
                } else {
                    console.error(`Attempted to load topic with number ${topicNumber}. Check if section ${sectionNumber} has topics.`);
                }
            });
        });
    }

    // ------------------------------------------------------------------

    // ------------------------------------------------------------------
    // The init() function logic is adjusted to prioritize URL parameters correctly.
    function init() {
        try {
            console.log("Initializing application...");

            if (!sectionsData || !sectionsData.sections) {
                console.error("Invalid data format:", sectionsData);
                throw new Error("Invalid data format: missing sections");
            }

            // Generate sidebar navigation (Desktop)
            generateSidebar();

            // Generate offcanvas topics (Mobile)
            generateOffcanvasTopics();
            setupNavbarLinks();

            // ==========================================================
            // Final Logic: Check URL parameters to load a specific topic or quiz
            // ==========================================================
            const requestedQuiz = getUrlParameter("quiz");
            const requestedSection = parseInt(getUrlParameter("section"));
            const requestedTopic = parseInt(getUrlParameter("topic"));

            let contentLoadedFromURL = false; // Flag to track if content was loaded from URL

            // 1. Priority to the Quiz parameter (if provided, start the quiz)
            if (requestedQuiz && quizzesData[requestedQuiz]) {
                console.log(`Loading requested quiz: ${requestedQuiz}`);
                startQuiz(requestedQuiz); // startQuiz now finds the section/topic numbers internally
                contentLoadedFromURL = true;
            }
            // 2. Then the Topic parameter
            else if (requestedSection > 0 && requestedTopic > 0) {
                console.log(`Loading requested topic: S${requestedSection}, T${requestedTopic}`);
                loadTopic(requestedSection, requestedTopic);
                contentLoadedFromURL = true;
            }

            // 3. Default Load (if no content was loaded from URL)
            if (!contentLoadedFromURL) {
                if (sectionsData.sections.length > 0 && sectionsData.sections[0].topics.length > 0) {
                    console.log("Loading default topic (1, 1).");
                    loadTopic(1, 1);
                } else {
                    showError("No sections or topics found in the data");
                }
            }
            // ==========================================================
        } catch (error) {
            showError(error.message);
        }
    }

    // Start the application
    init();
});
