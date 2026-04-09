export const INITIAL_KONTEN = {
  Draft: [
    { 
      id: 1, 
      type: 'doc', 
      version: "v1.0", 
      title: "Strategi Konten Q2: Global Expansion", 
      author: "Akmal Okhi", 
      initial: "AO", 
      date: "5 Mar", 
      deadline: new Date(Date.now() + 86400000).toISOString(), 
      priority: 'High',
      versions: [ 
        { v: "v1.0", note: "Draf awal dibuat", date: "5 Mar", user: "Akmal", comments: [] } 
      ]
    }
  ],
  Review: [
    { 
      id: 2, 
      type: 'design',
      version: "v2.1", 
      title: "Visual Asset: Ramadhan Mega Sale", 
      author: "Dafa Izul", 
      initial: "DI", 
      date: "28 Feb", 
      deadline: new Date(Date.now() - 86400000).toISOString(),
      priority: 'Urgent',
      versions: [
        { v: "v2.1", note: "Perubahan warna tombol sesuai request", date: "28 Feb", user: "Dafa", comments: [] },
        { 
          v: "v1.0", 
          note: "Konsep awal desain ramadhan", 
          date: "25 Feb", 
          user: "Dafa",
          comments: [
            { id: 101, user: "Client", text: "Tambahkan sedikit shadow pada tombol CTA.", time: "25 Feb, 14:00" }
          ] 
        }
      ]
    }
  ],
  Revisi: [
    { 
      id: 3, 
      type: 'video', 
      version: "v1.2", 
      title: "TikTok Ad: New Arrival", 
      author: "Vicky Fareli", 
      initial: "VF", 
      date: "22 Feb", 
      deadline: new Date(Date.now() + 43200000).toISOString(), 
      priority: 'Medium',
      versions: [
        { v: "v1.2", note: "Pemotongan durasi video", date: "22 Feb", user: "Vicky", comments: [] },
        { v: "v1.1", note: "Penambahan subtitle", date: "21 Feb", user: "Vicky", comments: [{ id: 102, user: "Client", text: "Subtitle terlalu cepat", time: "21 Feb" }] }
      ]
    }
  ],
  Approved: [
    { id: 4, type: 'doc', version: "v1.0", title: "Brand Voice Guidelines 2024", author: "Akmal Okhi", initial: "AO", date: "15 Mar", deadline: new Date(Date.now() - 500000000).toISOString(), priority: 'Low', versions: [{v: "v1.0", date: "15 Feb", note: "Final", comments: []}] }
  ]
};

export const TEAMS_DATA = [
  { name: "Akmal Okhi", role: "Creative Lead", status: "Active" },
  { name: "Dafa Izul", role: "Lead Designer", status: "Active" },
  { name: "Vicky Fareli", role: "Video Editor", status: "On Leave" },
  { name: "Husni", role: "Client / Reviewer", status: "Active" },
];
