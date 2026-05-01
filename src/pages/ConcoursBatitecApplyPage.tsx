import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { API_BASE_URL } from "../config";

type Category = "hotel" | "villa";

function getCategoryLabel(category: Category) {
  return category === "hotel" ? "Hôtel" : "Villa";
}

function getCategoryTitle(category: Category) {
  return category === "hotel"
    ? "Concours de concept architectural – Hôtel"
    : "Conception d’une villa résidentielle";
}

export default function ConcoursBatitecApplyPage() {
  const navigate = useNavigate();
  const params = useParams();
  const category = (params.category || "").toLowerCase() as Category;

  const isValidCategory = useMemo(() => category === "hotel" || category === "villa", [category]);
  const isClosed = true;

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error" | null; message: string }>({ type: null, message: "" });

  const [form, setForm] = useState({
    lastName: "",
    firstName: "",
    phone: "",
    email: "",
  });
  const [studentCardFile, setStudentCardFile] = useState<File | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!isValidCategory) navigate("/concours-batitec", { replace: true });
  }, [isValidCategory, navigate]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setStudentCardFile(file);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: null, message: "" });

    if (!form.lastName || !form.firstName || !form.phone || !form.email || !studentCardFile) {
      setStatus({ type: "error", message: "Veuillez remplir tous les champs obligatoires et joindre la carte d'étudiant." });
      return;
    }

    const allowed = ["application/pdf", "image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(studentCardFile.type)) {
      setStatus({ type: "error", message: "Format non accepté. Veuillez joindre une image (JPG/PNG/WEBP) ou un PDF." });
      return;
    }

    if (studentCardFile.size > 10 * 1024 * 1024) {
      setStatus({ type: "error", message: "Fichier trop volumineux (max 10 Mo)." });
      return;
    }

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("category", category.toUpperCase());
      fd.append("lastName", form.lastName);
      fd.append("firstName", form.firstName);
      fd.append("phone", form.phone);
      fd.append("email", form.email);
      fd.append("studentCard", studentCardFile);

      const res = await fetch(`${API_BASE_URL}/api/concours-batitec/applications`, {
        method: "POST",
        body: fd,
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus({ type: "error", message: data?.message || "Erreur lors de l'envoi. Veuillez réessayer." });
        return;
      }

      setStatus({ type: "success", message: data?.message || "Candidature envoyée." });
      navigate(`/concours-batitec/${category}/enonce`, { replace: true });
    } catch {
      setStatus({ type: "error", message: "Impossible de se connecter au serveur." });
    } finally {
      setLoading(false);
    }
  };

  if (!isValidCategory) return null;

  return (
    <div className="relative min-h-screen bg-[#031B17] font-['Montserrat'] text-white overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[900px] h-[900px] bg-[radial-gradient(circle,rgba(21,105,83,0.3),transparent_70%)]" />
        <div className="absolute top-[40%] right-[-10%] w-[700px] h-[700px] bg-[radial-gradient(circle,rgba(225,187,127,0.10),transparent_70%)]" />
        <div
          className="absolute inset-0 opacity-[0.05] mix-blend-overlay"
          style={{ backgroundImage: 'url("/texture.png")', backgroundSize: "1200px", backgroundRepeat: "repeat" }}
        />
      </div>

      <Header className="absolute top-0 left-0 z-40 w-full" />

      <section className="relative z-10 pt-28 md:pt-32 pb-20">
        <div className="mx-auto max-w-4xl px-4 md:px-10">
          <div className="text-center mb-10">
            <div className="text-xs uppercase tracking-[0.22em] text-white/55 mb-2">Candidature — {getCategoryLabel(category)}</div>
            <h1 className="text-2xl md:text-4xl font-bold uppercase tracking-wide text-[#F7C66A]">
              {getCategoryTitle(category)}
            </h1>
          </div>

          {status.type && (
            <div
              className={[
                "mb-6 rounded-2xl border px-5 py-4 text-sm",
                status.type === "success" ? "border-green-500/40 bg-green-500/15 text-green-100" : "border-red-500/40 bg-red-500/15 text-red-100",
              ].join(" ")}
            >
              {status.message}
            </div>
          )}

          <div className="rounded-3xl border border-white/10 bg-[#0C2A24]/75 backdrop-blur-md p-6 md:p-10 shadow-2xl">
            {isClosed ? (
              <div className="rounded-2xl border border-white/15 bg-white/5 px-6 py-6 text-center">
                <div className="text-sm text-white/85">Les candidatures ont été clôturées.</div>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-7">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <input
                  name="lastName"
                  value={form.lastName}
                  onChange={onChange}
                  placeholder="Nom*"
                  className="w-full bg-transparent border-b border-white/20 focus:border-[#F7C66A] outline-none px-1 py-3 text-sm placeholder:text-white/40"
                />
                <input
                  name="firstName"
                  value={form.firstName}
                  onChange={onChange}
                  placeholder="Prénom*"
                  className="w-full bg-transparent border-b border-white/20 focus:border-[#F7C66A] outline-none px-1 py-3 text-sm placeholder:text-white/40"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <input
                  name="phone"
                  value={form.phone}
                  onChange={onChange}
                  placeholder="Numéro de téléphone*"
                  className="w-full bg-transparent border-b border-white/20 focus:border-[#F7C66A] outline-none px-1 py-3 text-sm placeholder:text-white/40"
                />
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={onChange}
                  placeholder="Adresse Email*"
                  className="w-full bg-transparent border-b border-white/20 focus:border-[#F7C66A] outline-none px-1 py-3 text-sm placeholder:text-white/40"
                />
              </div>

              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-[#F7C66A] mb-3">
                  Télécharger votre carte d'étudiants* (Image ou PDF)
                </div>
                <label className="block rounded-2xl border border-white/10 bg-white/5 px-4 py-4 hover:border-[#F7C66A]/40 transition-colors cursor-pointer">
                  <input
                    type="file"
                    accept="application/pdf,image/*"
                    onChange={onFileChange}
                    className="hidden"
                  />
                  <div className="flex items-center justify-between gap-4">
                    <div className="text-sm text-white/80 truncate">
                      {studentCardFile ? studentCardFile.name : "Choisir un fichier"}
                    </div>
                    <div className="rounded-full border border-[#F7C66A]/60 px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-white hover:bg-[#F7C66A] hover:text-[#031B17] transition-colors">
                      Parcourir
                    </div>
                  </div>
                </label>
                <div className="mt-2 text-xs text-white/55">
                  Formats acceptés : PDF, JPG, PNG, WEBP — Taille max : 10 Mo
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full md:w-auto rounded-full bg-[#F7C66A] px-10 py-3 text-xs font-bold uppercase tracking-widest text-[#031B17] hover:bg-white transition-colors disabled:opacity-60"
              >
                {loading ? "Envoi..." : "Valider ma candidature"}
              </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
