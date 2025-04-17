async function getToken() {
  return localStorage.getItem("gh_token");
}
function saveToken() {
  const token = document.getElementById("token").value;
  localStorage.setItem("gh_token", token);
  showMessage("Token saved locally.");
}
function showMessage(msg) {
  document.getElementById("message").textContent = msg;
}
async function addSpell() {
  const name = document.getElementById("name").value.trim();
  const description = document.getElementById("description").value.trim();
  const category = document.getElementById("category").value;

  if (!name || !description) {
    showMessage("Name and description are required.");
    return;
  }

  const token = await getToken();
  if (!token) {
    showMessage("GitHub token is missing.");
    return;
  }

  const apiURL = "https://api.github.com/repos/harbz07/Grimoire/contents/grimoire.json";
  const headers = {
    "Authorization": "token " + token,
    "Accept": "application/vnd.github.v3+json"
  };

  try {
    const getRes = await fetch(apiURL, { headers });
    const getData = await getRes.json();

    const content = atob(getData.content);
    const json = JSON.parse(content);
    json.push({ name, description, category });

    const updatedContent = btoa(JSON.stringify(json, null, 2));

    const payload = {
      message: `Add ${name} via admin panel`,
      content: updatedContent,
      sha: getData.sha
    };

    const putRes = await fetch(apiURL, {
      method: "PUT",
      headers,
      body: JSON.stringify(payload)
    });

    if (putRes.ok) {
      showMessage(`✅ ${name} added!`);
    } else {
      const error = await putRes.json();
      showMessage("❌ Error: " + error.message);
    }
  } catch (err) {
    console.error(err);
    showMessage("❌ Unexpected error.");
  }
}
