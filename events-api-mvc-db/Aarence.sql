CREATE TABLE Events (
    id INT PRIMARY KEY IDENTITY(1,1),
    event_name NVARCHAR(100) NOT NULL,
    organizer NVARCHAR(100) NOT NULL,
    event_date DATE NOT NULL
);

CREATE TABLE Bookings (
    BookingID INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(100) NOT NULL,
    Email NVARCHAR(100) NOT NULL,
    SessionID INT NOT NULL,
    CONSTRAINT FK_Bookings_SessionID FOREIGN KEY (SessionID) REFERENCES Events(id)
);

INSERT INTO Events (event_name, organizer, event_date)
VALUES
('Keynote Speeches', 'Healthcare Association', '2024-08-10'),
('Workshops and Panels', 'Healthcare Association', '2024-08-11'),
('Networking and Closing Remarks', 'Healthcare Association', '2024-08-12'),
('Equipment Workshop', 'Sengkang General Hospital', '2024-08-13'),
('Deep Dive Sessions', 'Sengkang General Hospital', '2024-08-14'),
('Community Engagement and Wrap-Up', 'Sengkang General Hospital', '2024-08-15');
