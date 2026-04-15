-- Settings table
CREATE TABLE IF NOT EXISTS settings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  nama_website TEXT DEFAULT 'HMSTI',
  logo_himpunan TEXT,
  logo_kampus TEXT,
  nama_kampus TEXT DEFAULT 'Universitas Muria Kudus',
  instagram TEXT,
  facebook TEXT,
  youtube TEXT,
  email TEXT,
  alamat TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default settings
INSERT INTO settings (nama_website, nama_kampus, email, alamat)
VALUES ('HMSTI', 'Universitas Muria Kudus', 'hmsti@umk.ac.id', 'Gondangmanis, Bae, Kudus')
ON CONFLICT DO NOTHING;

-- Kegiatan table
CREATE TABLE IF NOT EXISTS kegiatan (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  judul TEXT NOT NULL,
  deskripsi TEXT,
  tanggal DATE NOT NULL,
  lokasi TEXT,
  kategori TEXT DEFAULT 'umum',
  gambar TEXT,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Galeri table
CREATE TABLE IF NOT EXISTS galeri (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  judul TEXT NOT NULL,
  gambar TEXT NOT NULL,
  kategori TEXT DEFAULT 'umum',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Anggota table
CREATE TABLE IF NOT EXISTS anggota (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  nama TEXT NOT NULL,
  jabatan TEXT NOT NULL,
  divisi TEXT DEFAULT '-',
  foto TEXT,
  instagram TEXT,
  tipe TEXT DEFAULT 'pengurus' CHECK (tipe IN ('pengurus', 'dewan_pengawas', 'demisioner')),
  periode TEXT NOT NULL,
  urutan INTEGER DEFAULT 99,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pendaftaran table
CREATE TABLE IF NOT EXISTS pendaftaran (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  nama TEXT NOT NULL,
  nim TEXT NOT NULL,
  email TEXT NOT NULL,
  no_hp TEXT NOT NULL,
  jurusan TEXT NOT NULL,
  angkatan TEXT NOT NULL,
  motivasi TEXT,
  pilihan_divisi TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'diterima', 'ditolak')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('media', 'media', true) ON CONFLICT DO NOTHING;

-- RLS Policies
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE kegiatan ENABLE ROW LEVEL SECURITY;
ALTER TABLE galeri ENABLE ROW LEVEL SECURITY;
ALTER TABLE anggota ENABLE ROW LEVEL SECURITY;
ALTER TABLE pendaftaran ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read settings" ON settings FOR SELECT USING (true);
CREATE POLICY "Public read kegiatan" ON kegiatan FOR SELECT USING (true);
CREATE POLICY "Public read galeri" ON galeri FOR SELECT USING (true);
CREATE POLICY "Public read anggota" ON anggota FOR SELECT USING (true);
CREATE POLICY "Public insert pendaftaran" ON pendaftaran FOR INSERT WITH CHECK (true);

-- Authenticated full access
CREATE POLICY "Auth all settings" ON settings FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth all kegiatan" ON kegiatan FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth all galeri" ON galeri FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth all anggota" ON anggota FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth all pendaftaran" ON pendaftaran FOR ALL USING (auth.role() = 'authenticated');
