document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      console.log("Form submit attempted");

      const type = form.querySelector("#type").value;
      const breed = form.querySelector("#breed").value;
      const quantity = form.querySelector("#quantity").value;
      const farmerType = form.querySelector("#farmerType").value;

      if (!type || !breed || !quantity || !farmerType) {
        alert("Please fill all required fields");
        return;
      }

      if (quantity < 1) {
        alert("Quantity must be at least 1");
        return;
      }

      console.log("Form data:", { type, breed, quantity, farmerType });

      fetch("/customer/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        credentials: "include", // Include cookies
        body: new URLSearchParams({
          type,
          breed,
          quantity,
          farmerType,
        }),
      })
        .then((response) => {
          console.log("Response status:", response.status); // Debug log
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.text();
        })
        .then(() => {
          console.log("Form submitted successfully");
          window.location.href = "/customer/requests";
        })
        .catch((error) => {
          console.error("Submission error:", error.message);
          alert(`Failed to submit request. Please try again. ${error.message}`);
        });
    });
  }
});
