document.addEventListener('DOMContentLoaded', function() {
  // Mengambil elemen canvas dan menginisialisasi SignaturePad
  var canvas = document.getElementById('signature-canvas');
  var signaturePad = new SignaturePad(canvas);

  // Fungsi untuk mengosongkan tanda tangan di kanvas
  document.getElementById('clear-signature').addEventListener('click', function() {
    signaturePad.clear();
  });

  // Contoh penanganan saat submit (sesuaikan dengan form yang sebenarnya jika ada)
  document.getElementById('FrmAddCatatanCNS')?.addEventListener('submit', function(e) {
    if (signaturePad.isEmpty()) {
      e.preventDefault();
      document.getElementById('signature-error').textContent = 'Tanda tangan diperlukan.';
    } else {
      document.getElementById('signature-error').textContent = '';
      document.getElementById('signature-input').value = signaturePad.toDataURL(); // Menyimpan data tanda tangan
    }
  });
});
