document.addEventListener("DOMContentLoaded", function () {
    // ✅ **Login Form Submit**
    document.getElementById("loginForm")?.addEventListener("submit", function (event) {
        event.preventDefault();
        
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        fetch("http://localhost:5000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                localStorage.setItem("user", JSON.stringify(data.user)); // Save user info
                if (data.user.userType === "admin") {
                    window.location.href = "owner.html";
                } else {
                    window.location.href = "dashboard.html";
                }
            } else {
                alert("Invalid Credentials!");
            }
        })
        .catch(error => console.error("Error:", error));
    });

    // ✅ **Registration Form Submit**
    document.getElementById("registerForm")?.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = document.getElementById("name").value;
        const mobile = document.getElementById("mobile").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;
        const dob = document.getElementById("dob").value;
        const address = document.getElementById("address").value;
        const userType = document.getElementById("userType").value;

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        fetch("http://localhost:5000/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, mobile, email, password, dob, address, userType })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("Registration successful! Redirecting to login...");
                window.location.href = "index.html";
            } else {
                alert(data.message);
            }
        })
        .catch(error => console.error("Error:", error));
    });

    // ✅ **Load Properties on Dashboard**
    function loadProperties() {
        fetch("http://localhost:5000/properties")
            .then(response => response.json())
            .then(data => {
                let propertyList = document.getElementById("propertyList");
                propertyList.innerHTML = "";
                data.forEach(property => {
                    let div = document.createElement("div");
                    div.className = "property";
                    div.innerHTML = `
                        <h3>${property.title}</h3>
                        <p>📍 ${property.location}</p>
                        <p>💰 ₹${property.price}</p>
                        <p>${property.description}</p>
                    `;
                    propertyList.appendChild(div);
                });
            });
    }
    if (document.getElementById("propertyList")) {
        loadProperties();
    }

    // ✅ **Add Property (Admin Only)**
    document.getElementById("addPropertyForm")?.addEventListener("submit", function (event) {
        event.preventDefault();

        let title = document.getElementById("title").value;
        let location = document.getElementById("location").value;
        let price = document.getElementById("price").value;
        let description = document.getElementById("description").value;

        fetch("http://localhost:5000/properties", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, location, price, description })
        }).then(() => {
            alert("Property Added!");
            window.location.href = "owner.html";
        });
    });

    // ✅ **Submit Feedback**
    document.getElementById("feedbackForm")?.addEventListener("submit", function (event) {
        event.preventDefault();

        let feedbackText = document.getElementById("feedbackText").value;
        let user = JSON.parse(localStorage.getItem("user")); // Get logged-in user

        fetch("http://localhost:5000/feedback", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: feedbackText, user: user ? user.name : "Anonymous" })
        }).then(() => {
            alert("Feedback Submitted!");
            loadFeedback();
        });
    });

    // ✅ **Load Feedback**
    function loadFeedback() {
        fetch("http://localhost:5000/feedback")
            .then(response => response.json())
            .then(data => {
                let feedbackList = document.getElementById("feedbackList");
                feedbackList.innerHTML = "";
                data.forEach(item => {
                    let div = document.createElement("div");
                    div.className = "feedback";
                    div.innerHTML = `<p><strong>${item.user}:</strong> ${item.text}</p>`;
                    feedbackList.appendChild(div);
                });
            });
    }
    if (document.getElementById("feedbackList")) {
        loadFeedback();
    }

    // ✅ **Load Profile Data**
    function loadProfile() {
        let user = JSON.parse(localStorage.getItem("user"));
        if (user) {
            document.getElementById("profileName").innerText = user.name;
            document.getElementById("profileEmail").innerText = user.email;
            document.getElementById("profileMobile").innerText = user.mobile;
            document.getElementById("profileDob").innerText = user.dob;
            document.getElementById("profileAddress").innerText = user.address;
            document.getElementById("profileUserType").innerText = user.userType;
        }
    }
    if (document.getElementById("profilePage")) {
        loadProfile();
    }

    // ✅ **Logout Button**
    document.getElementById("logout")?.addEventListener("click", function () {
        localStorage.removeItem("user");
        window.location.href = "index.html";
    });
});
