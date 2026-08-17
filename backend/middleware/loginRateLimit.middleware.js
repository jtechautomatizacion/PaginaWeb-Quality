const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const LOCKS_DIR = __dirname;
const MAX_ATTEMPTS = 5;
const LOCKOUT_MINUTES = 15;

function lockfileFor(ip) {
    const hash = crypto.createHash('md5').update(ip).digest('hex');
    return path.join(LOCKS_DIR, `.login_attempts_${hash}.json`);
}

function loginRateLimit(req, res, next) {
    const ip = req.ip || '127.0.0.1';
    const lockfile = lockfileFor(ip);
    req.__lockfile = lockfile;

    if (fs.existsSync(lockfile)) {
        const data = JSON.parse(fs.readFileSync(lockfile, 'utf-8'));
        const elapsedMs = Date.now() - data.timestamp;
        if (elapsedMs < LOCKOUT_MINUTES * 60 * 1000) {
            if (data.count >= MAX_ATTEMPTS) {
                const remainingSec = Math.ceil((LOCKOUT_MINUTES * 60 * 1000 - elapsedMs) / 1000);
                return res.status(429).json({
                    ok: false,
                    message: `Demasiados intentos fallidos. Intenta de nuevo en ${Math.ceil(remainingSec / 60)} minuto(s).`
                });
            }
        } else {
            fs.unlinkSync(lockfile);
        }
    }
    next();
}

function recordFailedAttempt(lockfile) {
    let data = { count: 1, timestamp: Date.now() };
    if (fs.existsSync(lockfile)) {
        const existing = JSON.parse(fs.readFileSync(lockfile, 'utf-8'));
        if (Date.now() - existing.timestamp < 15 * 60 * 1000) {
            data.count = existing.count + 1;
        }
    }
    fs.writeFileSync(lockfile, JSON.stringify(data));
}

function clearAttempts(lockfile) {
    if (fs.existsSync(lockfile)) fs.unlinkSync(lockfile);
}

module.exports = { loginRateLimit, recordFailedAttempt, clearAttempts };
