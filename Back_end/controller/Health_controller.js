const Health_controller = (req, res) => {
  const uptime = Math.floor(process.uptime());
  const memory = Math.round(process.memoryUsage().heapUsed / 1024 / 1024);
  const node_version = process.version;
  const timestamp = new Date().toLocaleString();

  res.status(200).send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>Rafifa Mart API</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
          font-family: 'Segoe UI', sans-serif;
          background: #0f0f0f;
          color: #fff;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
        }

        .card {
          background: #1a1a1a;
          border: 1px solid #2a2a2a;
          border-radius: 16px;
          padding: 48px;
          width: 480px;
          box-shadow: 0 0 40px rgba(0,200,100,0.08);
        }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(0,200,100,0.1);
          border: 1px solid rgba(0,200,100,0.3);
          color: #00c864;
          padding: 6px 14px;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 24px;
        }

        .dot {
          width: 8px;
          height: 8px;
          background: #00c864;
          border-radius: 50%;
          animation: pulse 1.5s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        h1 {
          font-size: 26px;
          font-weight: 700;
          margin-bottom: 6px;
          color: #ffffff;
        }

        .subtitle {
          color: #666;
          font-size: 14px;
          margin-bottom: 32px;
        }

        .divider {
          border: none;
          border-top: 1px solid #2a2a2a;
          margin-bottom: 28px;
        }

        .grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 28px;
        }

        .stat {
          background: #111;
          border: 1px solid #2a2a2a;
          border-radius: 10px;
          padding: 16px;
        }

        .stat .label {
          font-size: 11px;
          color: #555;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 8px;
        }

        .stat .value {
          font-size: 16px;
          font-weight: 600;
          color: #fff;
        }

        .stat .value span {
          color: #00c864;
        }

        .footer {
          font-size: 12px;
          color: #444;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="card">

        <div class="badge">
          <div class="dot"></div>
          All Systems Operational
        </div>

        <h1>Rafifa Mart API</h1>
        <p class="subtitle">Backend server is running smoothly</p>

        <hr class="divider" />

        <div class="grid">
          <div class="stat">
            <div class="label">Status</div>
            <div class="value"><span>Online</span></div>
          </div>
          <div class="stat">
            <div class="label">Version</div>
            <div class="value">v <span>1.0.0</span></div>
          </div>
          <div class="stat">
            <div class="label">Uptime</div>
            <div class="value"><span>${uptime}</span> sec</div>
          </div>
          <div class="stat">
            <div class="label">Memory</div>
            <div class="value"><span>${memory}</span> MB</div>
          </div>
          <div class="stat">
            <div class="label">Node</div>
            <div class="value"><span>${node_version}</span></div>
          </div>
          <div class="stat">
            <div class="label">Database</div>
            <div class="value"><span>MySQL</span></div>
          </div>
        </div>

        <hr class="divider" />

        <div class="footer">
          Last checked: ${timestamp}
        </div>

      </div>
    </body>
    </html>
  `);
};

module.exports = Health_controller;