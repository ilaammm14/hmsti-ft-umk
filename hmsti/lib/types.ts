export interface Settings {
  id: string
  nama_website: string
  logo_himpunan: string | null
  logo_kampus: string | null
  nama_kampus: string
  instagram: string | null
  facebook: string | null
  youtube: string | null
  email: string | null
  alamat: string | null
  video_url: string | null
  video_judul: string | null
  created_at: string
}

export interface Kegiatan {
  id: string
  judul: string
  deskripsi: string
  tanggal: string
  lokasi: string
  kategori: string
  gambar: string | null
  slug: string
  created_at: string
}

export interface Galeri {
  id: string
  judul: string
  deskripsi: string | null
  kategori: string
  created_at: string
  images?: GaleriImage[]
}

export interface GaleriImage {
  id: string
  galeri_id: string
  image_url: string
  created_at: string
}

export interface Anggota {
  id: string
  nama: string
  jabatan: string
  divisi: string
  foto: string | null
  instagram: string | null
  tipe: 'pengurus' | 'dewan_pengawas' | 'demisioner'
  periode: string
  urutan: number
  created_at: string
}
