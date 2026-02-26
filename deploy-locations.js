const fs = require('fs');
const path = require('path');

const API = 'https://murphy.dreamhosters.com/wp-json/wp/v2/pages';
const AUTH = 'Basic ' + Buffer.from('murphy_2u359x:Wjm9RXE0vYTzG68PHEWhacNL').toString('base64');
const LOCATIONS = path.join(__dirname, 'locations');

async function postPage(title, slug, content, parentId) {
  const body = JSON.stringify({
    title,
    slug,
    content,
    status: 'publish',
    parent: parentId,
  });

  const res = await fetch(API, {
    method: 'POST',
    headers: {
      'Authorization': AUTH,
      'Content-Type': 'application/json',
    },
    body,
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(`POST failed for "${slug}": ${res.status} — ${JSON.stringify(json)}`);
  }
  return json.id;
}

async function main() {
  // ── Hub pages (parent 0) ──────────────────────────────────────────────────
  const hubs = [
    {
      file: 'fairview-park/hub.html',
      title: 'Tree Service in Fairview Park, Ohio | Ilyas Tree Service',
      slug: 'fairview-park',
    },
    {
      file: 'north-ridgeville/hub.html',
      title: 'Tree Service in North Ridgeville, Ohio | Ilyas Tree Service',
      slug: 'north-ridgeville',
    },
    {
      file: 'columbia-station/hub.html',
      title: 'Tree Service in Columbia Station, Ohio | Ilyas Tree Service',
      slug: 'columbia-station',
    },
  ];

  const hubIds = {};
  for (const hub of hubs) {
    const content = fs.readFileSync(path.join(LOCATIONS, hub.file), 'utf8');
    console.log(`Posting hub: ${hub.slug}…`);
    const id = await postPage(hub.title, hub.slug, content, 0);
    hubIds[hub.slug] = id;
    console.log(`  → ID ${id}`);
  }

  // ── Service pages ─────────────────────────────────────────────────────────
  const services = [
    // Fairview Park
    { file: 'fairview-park/tree-removal.html',            title: 'Tree Removal in Fairview Park, Ohio | Ilyas Tree Service',            slug: 'fairview-park-tree-removal',            hub: 'fairview-park' },
    { file: 'fairview-park/tree-trimming.html',           title: 'Tree Trimming in Fairview Park, Ohio | Ilyas Tree Service',           slug: 'fairview-park-tree-trimming',           hub: 'fairview-park' },
    { file: 'fairview-park/emergency-tree-service.html',  title: 'Emergency Tree Service in Fairview Park, Ohio | Ilyas Tree Service',  slug: 'fairview-park-emergency-tree-service',  hub: 'fairview-park' },
    { file: 'fairview-park/storm-damage-cleanup.html',    title: 'Storm Damage Cleanup in Fairview Park, Ohio | Ilyas Tree Service',    slug: 'fairview-park-storm-damage-cleanup',    hub: 'fairview-park' },
    { file: 'fairview-park/stump-grinding.html',          title: 'Stump Grinding in Fairview Park, Ohio | Ilyas Tree Service',          slug: 'fairview-park-stump-grinding',          hub: 'fairview-park' },
    { file: 'fairview-park/commercial-tree-service.html', title: 'Commercial Tree Service in Fairview Park, Ohio | Ilyas Tree Service', slug: 'fairview-park-commercial-tree-service', hub: 'fairview-park' },
    // North Ridgeville
    { file: 'north-ridgeville/tree-removal.html',            title: 'Tree Removal in North Ridgeville, Ohio | Ilyas Tree Service',            slug: 'north-ridgeville-tree-removal',            hub: 'north-ridgeville' },
    { file: 'north-ridgeville/tree-trimming.html',           title: 'Tree Trimming in North Ridgeville, Ohio | Ilyas Tree Service',           slug: 'north-ridgeville-tree-trimming',           hub: 'north-ridgeville' },
    { file: 'north-ridgeville/emergency-tree-service.html',  title: 'Emergency Tree Service in North Ridgeville, Ohio | Ilyas Tree Service',  slug: 'north-ridgeville-emergency-tree-service',  hub: 'north-ridgeville' },
    { file: 'north-ridgeville/storm-damage-cleanup.html',    title: 'Storm Damage Cleanup in North Ridgeville, Ohio | Ilyas Tree Service',    slug: 'north-ridgeville-storm-damage-cleanup',    hub: 'north-ridgeville' },
    { file: 'north-ridgeville/stump-grinding.html',          title: 'Stump Grinding in North Ridgeville, Ohio | Ilyas Tree Service',          slug: 'north-ridgeville-stump-grinding',          hub: 'north-ridgeville' },
    { file: 'north-ridgeville/commercial-tree-service.html', title: 'Commercial Tree Service in North Ridgeville, Ohio | Ilyas Tree Service', slug: 'north-ridgeville-commercial-tree-service', hub: 'north-ridgeville' },
    // Columbia Station
    { file: 'columbia-station/tree-removal.html',            title: 'Tree Removal in Columbia Station, Ohio | Ilyas Tree Service',            slug: 'columbia-station-tree-removal',            hub: 'columbia-station' },
    { file: 'columbia-station/tree-trimming.html',           title: 'Tree Trimming in Columbia Station, Ohio | Ilyas Tree Service',           slug: 'columbia-station-tree-trimming',           hub: 'columbia-station' },
    { file: 'columbia-station/emergency-tree-service.html',  title: 'Emergency Tree Service in Columbia Station, Ohio | Ilyas Tree Service',  slug: 'columbia-station-emergency-tree-service',  hub: 'columbia-station' },
    { file: 'columbia-station/storm-damage-cleanup.html',    title: 'Storm Damage Cleanup in Columbia Station, Ohio | Ilyas Tree Service',    slug: 'columbia-station-storm-damage-cleanup',    hub: 'columbia-station' },
    { file: 'columbia-station/stump-grinding.html',          title: 'Stump Grinding in Columbia Station, Ohio | Ilyas Tree Service',          slug: 'columbia-station-stump-grinding',          hub: 'columbia-station' },
    { file: 'columbia-station/commercial-tree-service.html', title: 'Commercial Tree Service in Columbia Station, Ohio | Ilyas Tree Service', slug: 'columbia-station-commercial-tree-service', hub: 'columbia-station' },
  ];

  for (const svc of services) {
    const content = fs.readFileSync(path.join(LOCATIONS, svc.file), 'utf8');
    const parentId = hubIds[svc.hub];
    console.log(`Posting service: ${svc.slug} (parent ${parentId})…`);
    const id = await postPage(svc.title, svc.slug, content, parentId);
    console.log(`  → ID ${id}`);
  }

  console.log('\nAll 21 pages posted successfully.');
}

main().catch(err => { console.error(err.message); process.exit(1); });
