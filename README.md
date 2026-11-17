# Inflation City 2026 — Version 9: Revolution Judgment & Repair-to-Own

Multiplayer economics and government simulation for up to **16 students** plus a separate teacher/spectator host. The property board is flat with raised mini-buildings. Taxes, disasters, elections, oligarchy, dictator God Mode, and free-flowing economic events remain in place. All monetary values are classroom simulation amounts.

## What's new

### Post-dictatorship judgment: citizens decide

When a **revolution succeeds** or a **constitutional election replaces the dictator**, the city triggers a mandatory second vote. The former dictator **cannot vote**. Every other active citizen votes once; punishment requires a simple majority of eligible non-dictator citizens. A tie or lack of a majority means **forgiveness**.

- **Punish / confiscate:** Seize all positive cash held by the former dictator. Distribute it as evenly as possible among the other active players (any whole-dollar remainder is distributed one dollar at a time). Return **all properties owned by the former dictator to City Bank**, making them available to buy again. The ex-dictator **misses their next scheduled turn** and is **permanently barred from acquiring any property**, including by repairing or receiving a God Mode transfer. After the missed turn they may still roll dice, pay bills, collect wages and take non-property actions. Existing debt is not erased.
- **Forgive / leave them alone:** Keep their cash, debts, property ownership, turn order, and future buying rights unchanged.

The new vote appears in the **ballot panel above the board**. The teacher can close it early; outstanding ballots count as abstentions, not as punishment votes. A successful revolution still must first meet the original **two-thirds citizen threshold**. Both the initial coup and final verdict create synchronized citywide breaking news. Individual purchases and repairs remain in the public transaction ledger without full-screen interruption.

### Repair-to-own

Any **active, eligible player** may repair **any damaged property** from their own device, even if they do not own it and it is not their turn. Their payment covers only the **published repair price**, based on the damage level. On successful repair:

- The damaged/closed marker is cleared and the property reopens.
- The **title immediately transfers to the player who paid**, whether the previous owner was City Bank or another student. **There is no additional purchase fee**.
- The player who owned the property before the repair receives **no automatic compensation** (a deliberate gameplay rule). Existing upgrade level remains; the public ledger records payer, repair cost, former owner, and new owner.
- The repaired property again generates rent unless a government public-service rule makes its use free.

A sanctioned former dictator subject to the permanent acquisition ban **cannot repair-and-claim** land. There is no automatic refund for repairing a property you already own.

## Playing on one computer

Open the provided `inflation-city-v9.html` file or `index.html` in a browser. Choose one-computer play and enter student names. In the local mode the game cycles through eligible voters automatically and lets you choose who pays for repairs.

## Classroom multiplayer from your laptop (local network)

1. Extract the ZIP; do not run it directly from the archive.
2. Install Node.js (https://nodejs.org/) if missing.
3. Double-click `START-WINDOWS.bat` (Windows Explorer may display the filename simply as `START-WINDOWS`) and leave the window running.
4. Open `http://localhost:3000`, select **Host Room**, then copy the student invite link.
5. Students open the invite link, enter their names, and join. Start the classroom session after they appear in the lobby.

Your teacher laptop must remain on and reachable on the students' Wi-Fi; some school networks block local peer connections.

## Put the game online (if the old GitHub/Render setup was deleted)

1. Create a new GitHub repository (for example, `inflation-city`), and upload **the 10 extracted files**, not the ZIP itself. Keep all files at the repository root (`engine.js`, `index.html`, `ui.html`, `server.js`, `test.js`, `package.json`, `render.yaml`, `README.md`, and both launch scripts).
2. In Render, create a **Web Service** connected to that GitHub repository. Do not use a Static Site or GitHub Pages: real-time multiplayer requires a Node.js server.
3. Choose Node, branch `main`, Root Directory blank, Build Command `npm install`, Start Command `npm start`. Select the free instance if available, checking your account's billing page before deploying.
4. After deployment shows **Live**, open the Render web-service URL, create a room, and share the generated student invite link.

Render free services can sleep when idle, have resource limits, and can lose local room data if restarted. This demo keeps classroom state in server-side local JSON files rather than durable database storage. Consider persistent storage/hosting for important games, and rehearse the 16-player session before class. This is not a managed school student-information platform; use first names or nicknames and avoid sensitive personal information.

## Tests and source files

- Run `npm test` or `node test.js` in the extracted folder.
- `engine.js` contains authoritative game rules, `server.js` authenticates sessions and synchronizes game state, and `ui.html` is UI source with `/*ENGINE*/` placeholder.
- `index.html` is the built page containing the engine and UI together. If editing game code, rebuild it by replacing `/*ENGINE*/` in `ui.html` with all of `engine.js`.
- All 16 players share the same room and see ownership/vote changes. The teacher acts as spectator/host and does not consume a student seat.

Version 9 replaces Version 8; do not mix old and new `engine.js`, `ui.html` or `index.html` files. Existing games from older versions may not be compatible with new rules; create a fresh classroom game room after updating.
