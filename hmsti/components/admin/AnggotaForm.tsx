'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import type { Anggota } from '@/lib/types'
import ImageUpload from './ImageUpload'

const DEPARTEMEN: Record<string, string[]> = {
  inti: ['Komunikasi dan Informasi', '-'],
  internal: ['Minat dan Bakat', 'Kerohanian', 'Pendidikan dan Kaderisasi', 'Kesektretariatan'],
  external: ['Pengabdian Masyarakat', 'Hubungan Luar', 'Ekonomi Kreatif'],
}

function parseBagian(divisi: string) {
  if (divisi.startsWith('inti:') || divisi.startsWith('internal:') || divisi.startsWith('external:')) {
    const [bagian, ...rest] = divisi.split(':')
    return { bagian, namaDivisi: rest.join(':') }
  }
  return { bagian: 'inti', namaDivisi: divisi }
}

// Field yang wajib diisi per tipe
const REQUIRED_FIELDS: Record<string, string[]> = {
  pengurus: ['nama', 'jabatan', 'bagian', 'namaDivisi', 'periode'],
  dewan_pengawas: ['nama', 'periode'],
  dewan_pembimbing: ['nama'],
  demisioner: ['nama', 'periode'],
}

export default function AnggotaForm({ anggota }: { anggota?: Anggota }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const parsed = anggota ? parseBagian(anggota.divisi || '-') : { bagian: 'inti', namaDivisi: '-' }

  const [form, setForm] = useState({
    nama: anggota?.nama || '',
    jabatan: anggota?.jabatan || '',
    bagian: parsed.bagian,
    namaDivisi: parsed.namaDivisi || DEPARTEMEN[parsed.bagian]?.[0] || '-',
    foto: anggota?.foto || '',
    instagram: anggota?.instagram || '',
    tipe: anggota?.tipe || 'pengurus',
    periode: anggota?.periode || '2024/2025',
    urutan: anggota?.urutan ?? null as number | null,
  })

  const isPengurus = form.tipe === 'pengurus'
  const isDewanPengawas = form.tipe === 'dewan_pengawas'
  const isDewanPembimbing = form.tipe === 'dewan_pembimbing'
  const isDemisioner = form.tipe === 'demisioner'

  useEffect(() => {
    if (anggota) return
    const supabase = createClient()
    supabase.from('anggota').select('urutan').order('urutan', { ascending: false }).limit(1).single()
      .then(({ data }) => {
        setForm(prev => ({ ...prev, urutan: data ? (data.urutan || 0) + 1 : 1 }))
      })
  }, [anggota])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    if (name === 'bagian') {
      setForm(prev => ({ ...prev, bagian: value, namaDivisi: DEPARTEMEN[value]?.[0] || '-' }))
    } else if (name === 'tipe') {
      // Reset field yang tidak relevan saat tipe berubah
      setForm(prev => ({
        ...prev,
        tipe: value,
        jabatan: value === 'pengurus' ? prev.jabatan : '',
        bagian: 'inti',
        namaDivisi: '-',
      }))
    } else {
      setForm(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()

    // Bangun divisi hanya untuk pengurus
    let divisi = '-'
    if (isPengurus && form.namaDivisi && form.namaDivisi !== '-') {
      divisi = `${form.bagian}:${form.namaDivisi}`
    }

    const data: Record<string, unknown> = {
      nama: form.nama,
      tipe: form.tipe,
      foto: form.foto,
      instagram: form.instagram,
      urutan: form.urutan !== null ? Number(form.urutan) : 99,
    }

    // Field kondisional
    if (isPengurus) {
      data.jabatan = form.jabatan
      data.divisi = divisi
      data.periode = form.periode
    } else if (isDewanPengawas || isDemisioner) {
      data.jabatan = form.jabatan || form.tipe === 'dewan_pengawas' ? 'Dewan Pengawas' : form.jabatan
      data.divisi = '-'
      data.periode = form.periode
    } else if (isDewanPembimbing) {
      data.jabatan = form.jabatan || 'Dewan Pembimbing'
      data.divisi = '-'
      data.periode = form.periode || '-'
    }

    if (anggota) {
      const { error } = await supabase.from('anggota').update(data).eq('id', anggota.id)
      if (error) toast.error('Gagal update: ' + error.message)
      else { toast.success('Berhasil diupdate'); router.push('/admin/anggota') }
    } else {
      const { error } = await supabase.from('anggota').insert([data])
      if (error) toast.error('Gagal menyimpan: ' + error.message)
      else { toast.success('Berhasil disimpan'); router.push('/admin/anggota') }
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border dark:border-gray-700 max-w-2xl space-y-5">

      {/* Nama — selalu wajib */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nama *</label>
        <input name="nama" value={form.nama} onChange={handleChange} required
          className="w-full px-4 py-2.5 border dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      {/* Tipe */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tipe *</label>
        <select name="tipe" value={form.tipe} onChange={handleChange}
          className="w-full px-4 py-2.5 border dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="pengurus">Pengurus</option>
          <option value="dewan_pengawas">Dewan Pengawas</option>
          <option value="dewan_pembimbing">Dewan Pembimbing</option>
          <option value="demisioner">Demisioner</option>
        </select>
      </div>

      {/* Jabatan — wajib untuk pengurus, opsional untuk lainnya */}
      {!isDewanPembimbing && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Jabatan {isPengurus ? '*' : <span className="text-gray-400 font-normal">(opsional)</span>}
          </label>
          <input name="jabatan" value={form.jabatan} onChange={handleChange} required={isPengurus}
            placeholder={isDewanPengawas ? 'cth: Ketua Dewan Pengawas' : isDemisioner ? 'cth: Ketua' : ''}
            className="w-full px-4 py-2.5 border dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
      )}

      {/* Bagian & Departemen — hanya untuk pengurus */}
      {isPengurus && (
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bagian *</label>
            <select name="bagian" value={form.bagian} onChange={handleChange}
              className="w-full px-4 py-2.5 border dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="inti">Pengurus Inti</option>
              <option value="internal">Internal</option>
              <option value="external">External</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Departemen / Divisi *</label>
            <select name="namaDivisi" value={form.namaDivisi} onChange={handleChange}
              className="w-full px-4 py-2.5 border dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              {DEPARTEMEN[form.bagian]?.map(d => (
                <option key={d} value={d}>{d === '-' ? '— (tidak ada divisi)' : d}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Periode — wajib untuk pengurus & demisioner, opsional untuk dewan */}
      {!isDewanPembimbing && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Periode {(isPengurus || isDemisioner) ? '*' : <span className="text-gray-400 font-normal">(opsional)</span>}
          </label>
          <input name="periode" value={form.periode} onChange={handleChange}
            required={isPengurus || isDemisioner} placeholder="2024/2025"
            className="w-full px-4 py-2.5 border dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
      )}

      {/* Urutan */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Urutan <span className="text-gray-400 font-normal text-xs">(otomatis)</span>
        </label>
        <input name="urutan" type="number" value={form.urutan ?? ''} onChange={handleChange}
          className="w-full px-4 py-2.5 border dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      {/* Foto */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Foto</label>
        <ImageUpload value={form.foto} onChange={(url) => setForm(prev => ({ ...prev, foto: url }))} folder="anggota" />
      </div>

      {/* Instagram */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Link Instagram</label>
        <input name="instagram" value={form.instagram} onChange={handleChange} placeholder="https://instagram.com/..."
          className="w-full px-4 py-2.5 border dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      <div className="flex gap-3">
        <button type="submit" disabled={loading}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-medium rounded-xl transition-colors">
          {loading ? 'Menyimpan...' : 'Simpan'}
        </button>
        <button type="button" onClick={() => router.back()}
          className="px-6 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
          Batal
        </button>
      </div>
    </form>
  )
}
