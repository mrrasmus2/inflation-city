# Inflation City V11 — Sound City Edition

Version 11 adds original upbeat music, player-only dice and movement sounds, individualized SFX, and separate music/effects controls. All Version 10 gameplay rules are retained.

**Audio setup**: open the game, click **🎵 Play music** to start the original soundtrack, and adjust the Music slider. Effects are enabled by default but each student's audio will only begin after they interact with the game (browser autoplay policy). They can mute effects separately. Only the person pressing Roll hears the dice and movement. Significant citywide events, elections, and disasters can be heard on all devices with effects enabled.

**Installing**: upload the entire extracted ZIP contents to your GitHub repository, overwriting matching files. Render automatically redeploys if enabled. `index.html` embeds the sound engine and needs no additional audio hosting. The readable source `soundscape.js` is included for future development. **Do not redeploy while students are playing**, because an app restart may interrupt a room.

---

# Inflation City 2026 — Version 10: Living City

**A classroom economic and political board game for 2–16 students per room, plus a separate teacher host.** One web server can run multiple independent rooms simultaneously (for example, two groups of eight). All players in a room see the same cash, deeds, tax policy, dice positions, property damage and teacher events via server-sent events and polling fallback.

The game's prices and government mechanics are deliberately simplified **fictional simulations**, not real tax regulations or a universal representation of political systems.

## Existing V10 gameplay retained

- **Teacher God Mode, host only:** Pause/resume; give/take money; set the wage, CPI, overall asset-price index and income tax rate; create inflation, unemployment, recession, stimulus or growth shocks; choose affected players/groups; trigger wildfire, flood, earthquake or power surge on selected properties; close or restore a title; call government elections and policy votes; suspend/reinstate/remove a student; and undo the previous game action. All interventions are saved in the shared event record. The teacher is a spectator, not one of the 16 student players.
- **A stronger IRS:** More than 20 possible audit outcomes; larger tax refunds, deductions, back-tax assessments and penalties. IRS events provide a dedicated announcement for the affected student, not a disruptive popup for every other student. IRS visits are still mandatory by the end of Round 2, except for exempt dictators.
- **Persistent newsroom:** A scrolling activity history outside the board, more visible headline alerts, and longer important announcements. Normal transactions do not open full-screen popups for all students. Major citywide emergencies and votes do.
- **Classroom audio (V11):** Original upbeat 126-BPM sequenced soundtrack (melody, bass, percussion), dice shaking and landing, personal token steps, and distinctive transaction, benefit, warning, election, coup, and disaster effects. Music and effects have independent toggles and sliders. Browsers require a user interaction to begin audio.
- **Fair dice:** Multiplayer dice use cryptographic random numbers. Standard two six-sided dice make totals around seven more likely than two or twelve; this is mathematically expected, not a bug. The numbered player token still animates around the board.
- **Player-to-player trades:** Students can propose a cash purchase, request a property swap, give cash or give land. The receiving student accepts or rejects an offer. Server-side validation prevents trading another player's property, making invalid acquisitions, or spending cash the buyer lacks. All accepted deals immediately synchronize and update the public ledger.
- **Quality of life matters:** Very low wellbeing incurs recurring medical/living costs and can reduce the rent yield from businesses; very high wellbeing provides productivity rewards. Students can invest in healthcare, housing, education or community support once per round. Existing government public-service rules also provide benefits.
- **Host management:** Remove students from the waiting room. During play, temporarily suspend, remove or reinstate a student from the teacher console. The student cannot act while suspended. The game retains their player position and historical records to avoid corrupting other players' ownership references.
- **More voting:** Over 30 policy proposals plus government elections, dictator decrees, oligarch influence, revolutions and former-dictator judgment votes. Every approved proposal changes economic values, wages, prices, rates, cash or market sectors.
- **Dictator usability:** Input values and focus are restored after synchronized screen updates, so the dictator does not lose a half-entered amount or selection during a live event. Ruler God Mode still has unlimited executive actions while dictatorship is in force.
- **Three-dimensional city models:** Procedural **real 3D building geometry** (walls, rooftops, windows, station structures, towers, hospitals, houses, retail, solar and wind assets). A single accelerated WebGL overlay rotates and zooms above the flat board, with a geometrically projected Canvas 2D fallback for devices that disable WebGL. Ownership colors, upgrades, construction growth, damage and repairs are reflected in the model. The central park has animated traffic and pedestrians. No external CDN or paid 3D library is needed.

All Version 9 dictatorship/revolution votes, permanent post-judgment property bans, two-round taxes, surprise events, repair-to-own, suspended rent on damaged properties, and 16-player rooms remain intact.

## Easiest way for the whole class to play (public website)

1. Extract **inflation-city-v10-multiplayer.zip**.
2. In GitHub, open your `inflation-city` repository. Choose **Add file → Upload files** and upload the **individual extracted files**, not the ZIP. If replacing a previous version, upload the updated files directly into the existing repository; **you do not need to delete the repository**. Commit the changes. Do not upload `data/` saved room folders, tokens or student records.
3. In Render, create or reuse a **Web Service** connected to that GitHub repo. Set runtime **Node**, branch `main`, build command `npm install`, start command `npm start`, root directory blank, and choose a plan you intend to use. The included `render.yaml` can also configure a Blueprint deployment.
4. After deployment is Live, open your actual Render website URL. Click **Host Room**, enter your teacher name, select rounds, and create a class session.
5. Send the room's **single invitation link** to students. They open the page, enter a name and join automatically. Two different host sessions = two independent rooms of eight, if desired.

**Important hosting limitation:** Render free services may sleep after periods of inactivity, and **local room files on free ephemeral hosting are not guaranteed to survive restarts**. Test the website on at least two devices before class, keep a backup, and do not deploy updates while students are playing. For durable cross-restart game persistence, add a persistent database or disk-supported hosting plan. The game runs in one Node process; avoid multiple server instances without shared session storage.

## Running it on Windows without public hosting

1. Extract the ZIP to a folder on your Windows computer.
2. Install Node.js 18 or newer.
3. Double-click **START-WINDOWS** (Windows may hide `.bat`). Keep the black server window open.
4. Visit `http://localhost:3000` on the host, select **Host Room** and create a class session.
5. Copy the generated local-network student invite URL. Devices must be on a network that allows clients to reach your computer. School guest/student Wi-Fi may isolate devices.

A plain downloaded `index.html` file can run **one-computer local mode**, but it cannot host a real shared online room without the server.

## Technical structure

| File | Purpose |
| --- | --- |
| `index.html` | Self-contained browser app with embedded engine, UI and 3D renderer |
| `ui.html` | Editable source template for browser UI |
| `engine.js` | Deterministic game rules and server-authoritative actions |
| `city3d.js` | Procedural WebGL/Canvas 3D building renderer |
| `server.js` | Authenticated room, student actions, admin actions, autosave and live events |
| `package.json` | Node startup and test scripts |
| `render.yaml` | Render Blueprint configuration |
| `START-WINDOWS.bat`, `START-MAC-LINUX.sh` | Local-server launchers |
| `test.js`, `test-v10.js`, `test-audio-v11.js` | Legacy/full multiplayer checks plus audio-engine and client-only sound regression tests |

Run `npm test` to execute both test suites. To create new standalone HTML after editing the source engine or 3D renderer, rebuild `index.html` by inserting the contents of `engine.js` into the `/*ENGINE*/` placeholder and `city3d.js` into the `/*CITY3D*/` placeholder in `ui.html`.

### Teacher override / undo limitations

The teacher can undo the most recently recorded game action (up to 15 available in-memory server snapshots). **Undo is game-state rollback, not a network-time-machine:** student clients will receive the restored state after synchronization; students who were disconnected must refresh. Undo history resets when the server restarts; room saves on ephemeral hosting may also disappear. Unsaved files on an ephemeral hosting service cannot be recovered after loss. To stop the clock, use **Pause**; that stops both student actions and random surprise events.

### Classroom guidance

The game illustrates economic trade-offs but should not be interpreted as asserting that one real political system universally provides the simulated effects. Teacher God Mode can create very large financial changes, so it is best to announce that interventions are part of the simulation. Standard two-dice probabilities are intentionally preserved rather than artificially forcing landings onto special board spaces.

**Music and sound ownership:** All melodies and sound effects are original generated Web Audio signals. No copyrighted recorded music, external media streams, downloads, or external sound libraries are needed. Audio preferences are stored locally per device.
