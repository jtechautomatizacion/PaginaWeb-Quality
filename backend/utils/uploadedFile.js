const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.join(__dirname, '..', '..');
const UPLOADS_ROOT = path.join(PROJECT_ROOT, 'assets', 'uploads');

function deleteIfUploaded(relativeUrl) {
    if (!relativeUrl || !relativeUrl.startsWith('assets/uploads/')) return;
    const target = path.resolve(PROJECT_ROOT, relativeUrl);
    if (!target.startsWith(UPLOADS_ROOT)) return;
    if (fs.existsSync(target) && fs.statSync(target).isFile()) {
        fs.unlinkSync(target);
    }
}

module.exports = { PROJECT_ROOT, UPLOADS_ROOT, deleteIfUploaded };
