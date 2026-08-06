async function check() {
  const res = await fetch('http://localhost:3000/api/testdb');
  const json = await res.json();
  console.log(JSON.stringify(json, null, 2));
}
check();
