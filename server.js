import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files from the 'public' directory

// In-memory storage for demo purposes
const resumes = {};

// Route to handle resume creation
app.post('/api/resumes/:username', (req, res) => {
    const username = req.params.username;
    const resumeData = req.body;

    resumes[username] = resumeData;

    res.json({
        url: `http://localhost:${port}/${username}/resume`
    });
});

// Route to serve the resume
app.get('/:username/resume', (req, res) => {
    const username = req.params.username;
    const resumeData = resumes[username];

    if (resumeData) {
        res.send(renderResume(resumeData));
    } else {
        res.status(404).send('Resume not found');
    }
});

function renderResume(data) {
    return `
        <html>
        <head>
            <title>Resume</title>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.4.0/jspdf.umd.min.js"></script>
        </head>
        <body>
            <button id="downloadPdf">Download as PDF</button>
            <h2>${data.name}</h2>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Phone:</strong> ${data.phone}</p>
            <h3>Education</h3>
            <p>${data.education}</p>
            <h3>Skills</h3>
            <p>${data.skills}</p>
            <h3>Work Experience</h3>
            <p>${data.workExperience}</p>
            <h3>Hobbies</h3>
            <p>${data.hobbies || 'No hobbies listed.'}</p>
            <script>
                document.getElementById('downloadPdf').addEventListener('click', () => {
                    const { jsPDF } = window.jspdf;
                    const doc = new jsPDF();
                    doc.text(document.body.innerText, 10, 10);
                    doc.save('resume.pdf');
                });
            </script>
        </body>
        </html>
    `;
}

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
