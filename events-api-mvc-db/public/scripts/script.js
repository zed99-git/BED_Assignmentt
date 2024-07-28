async function fetchEvents() {
    const response = await fetch("/events"); // Replace with your API endpoint
    const data = await response.json();
  
    const eventList = document.getElementById("event-list");
  
    data.forEach((event) => {
      const eventItem = document.createElement("div");
      eventItem.classList.add("event"); // Add a CSS class for styling
  
      // Create elements for event_name, organizer, etc. and populate with event data
      const eventNameElement = document.createElement("h2");
      eventNameElement.textContent = event.event_name;
  
      const organizerElement = document.createElement("p");
      organizerElement.textContent = `By: ${event.organizer}`;

      const eventDate = new Date(event.event_date);
        const eventDateFormatted = eventDate.toLocaleDateString(); // Format date to 'MM/DD/YYYY'
  
        const eventDateElement = document.createElement("p");
        eventDateElement.textContent = eventDateFormatted;
  
      // ... add more elements for other event data (optional)
  
      eventItem.appendChild(eventNameElement);
      eventItem.appendChild(organizerElement);
      eventItem.appendChild(eventDateElement);
      // ... append other elements
  
      eventList.appendChild(eventItem);
    });
  }
  
  async function bookSession(event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const session_id = document.getElementById("session_id").value;

    try {
        const response = await fetch("/sessions/book", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, email, session_id })
        });

        if (response.ok) {
            alert("Session booked successfully!");
        } else {
            const errorData = await response.json();
            alert(`Error: ${errorData.message}`);
        }
    } catch (error) {
        console.error("Error booking session:", error);
        alert("An error occurred while booking the session.");
    }
}

document.getElementById("bookingForm").addEventListener("submit", bookSession);


  fetchEvents(); // Call the function to fetch and display event data