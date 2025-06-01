// Konfiguracja Firebase (uzupełnij swoimi danymi z konsoli Firebase)
const firebaseConfig = {
  apiKey: "TU_WPISZ_API_KEY",
  authDomain: "TU_WPISZ_AUTH_DOMAIN",
  projectId: "TU_WPISZ_PROJECT_ID",
  storageBucket: "TU_WPISZ_STORAGE_BUCKET",
  messagingSenderId: "TU_WPISZ_SENDER_ID",
  appId: "TU_WPISZ_APP_ID"
};

// Inicjalizacja Firebase
firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();

const fileInput = document.getElementById('fileInput');
const uploadBtn = document.getElementById('uploadBtn');
const status = document.getElementById('status');
const gallery = document.getElementById('gallery');

uploadBtn.addEventListener('click', async () => {
  if (!fileInput.files.length) {
    status.textContent = 'Wybierz przynajmniej jedno zdjęcie.';
    return;
  }

  status.textContent = 'Przesyłanie...';

  for (const file of fileInput.files) {
    const storageRef = storage.ref('wesele/' + Date.now() + '_' + file.name);
    try {
      await storageRef.put(file);
    } catch (e) {
      console.error(e);
      status.textContent = 'Błąd podczas przesyłania.';
      return;
    }
  }

  status.textContent = 'Zdjęcia przesłane!';
  fileInput.value = '';
  loadGallery();
});

async function loadGallery() {
  gallery.innerHTML = '';
  const listRef = storage.ref('wesele/');
  try {
    const res = await listRef.listAll();
    res.items.forEach(async (itemRef) => {
      const url = await itemRef.getDownloadURL();
      const img = document.createElement('img');
      img.src = url;
      img.className = "rounded shadow-md object-cover w-full h-32";
      gallery.appendChild(img);
    });
  } catch (e) {
    console.error(e);
  }
}

loadGallery();
