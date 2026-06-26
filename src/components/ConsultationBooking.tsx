import React, { useState, useEffect } from "react";

const CONTRACT_TEXT = `⚠ NATURE DU SERVICE — À LIRE AVANT SIGNATURE
Cette séance de consulting est un service d'accompagnement étudiant basé sur une expérience personnelle concernant les études en Espagne. Ce service NE constitue EN AUCUN CAS un conseil juridique, financier, fiscal, administratif ou officiel. R-Consulting n'est pas avocat, gestionnaire officiel ni conseiller agréé. Les informations partagées sont purement indicatives. Le Client reste seul et entièrement responsable de ses décisions.

Article 1 — Objet et nature du service
Le présent contrat a pour objet la prestation d'une consultation orientative de 30 à 60 minutes par vidéoconférence via Google Meet, portant exclusivement sur les études en Espagne.

Article 2 — Prix et modalité de paiement
Le paiement s'effectue avant la session par carte bancaire. La session ne sera confirmée qu'après réception et vérification du paiement.

Article 3 — Politique de non-remboursement
Le paiement est définitif, ferme et non remboursable dès lors que la session a été confirmée. Exception unique : si R-Consulting annule la session sans alternative dans les 5 jours, remboursement intégral.

Article 4 — Planification et modification d'horaire
Toute demande de modification doit être effectuée au minimum 48 heures avant la session. Annulation moins de 48h : session perdue, aucun remboursement.

Article 5 — Interdiction absolue d'enregistrement
L'enregistrement de la session est STRICTEMENT INTERDIT sous toute forme.

Article 6 — Obligations du Client
Être connecté à l'heure exacte convenue. Disposer d'une connexion internet stable. Se comporter avec respect et courtoisie.

Article 7 — Absence de garantie de résultat
R-Consulting ne garantit aucun résultat auprès d'organismes officiels. Les informations reflètent une expérience personnelle.

Article 8 — Limitation de responsabilité
La responsabilité totale de R-Consulting est strictement limitée au montant payé pour la consultation.

Article 9 — Propriété intellectuelle
Le contenu partagé est la propriété intellectuelle exclusive de R-Consulting.

Article 10 — Confidentialité
R-Consulting s'engage à ne pas divulguer les informations personnelles du Client à des tiers, sauf obligation légale.`;

interface ConsultationBookingProps {
  lang: string;
  student: any;
  consultationPrice: number;
}

const HOURS = ["16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00"];
const DAYS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

export const ConsultationBooking: React.FC<ConsultationBookingProps> = ({ lang, student, consultationPrice }) => {
  const [step, setStep] = useState<"info" | "contract" | "calendar" | "payment" | "done">("info");
  const [phone, setPhone] = useState(student?.phone || "");
  const [email, setEmail] = useState(student?.email || "");
  const [acceptContract, setAcceptContract] = useState(false);
  const [acceptDataTransfer, setAcceptDataTransfer] = useState(false);
  const [signatureName, setSignatureName] = useState("");
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedHour, setSelectedHour] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/consultation/booked-slots")
      .then(r => r.json())
      .then(d => setBookedSlots(d.slots || []))
      .catch(() => {});
  }, []);

  const price = consultationPrice || 30;

  const handleInfoNext = () => {
    if (!phone.trim() || !email.trim()) { setError("Por favor, introduce tu teléfono y correo electrónico."); return; }
    if (!email.includes("@")) { setError("El correo electrónico no es válido."); return; }
    setError("");
    setStep("contract");
  };

  const handleContractNext = () => {
    if (!acceptContract) { setError("Debes aceptar el contrato para continuar."); return; }
    if (!acceptDataTransfer) { setError("Debes aceptar la política de transferencia de datos."); return; }
    if (!signatureName.trim()) { setError("Por favor, introduce tu nombre para firmar el contrato."); return; }
    setError("");
    setStep("calendar");
  };

  const handleCalendarNext = () => {
    if (!selectedDay || !selectedHour) { setError("Por favor, selecciona un día y una hora."); return; }
    const slot = `${selectedDay}-${selectedHour}`;
    if (bookedSlots.includes(slot)) { setError("Este horario ya está reservado. Por favor, elige otro."); return; }
    setError("");
    setStep("payment");
  };

  const handlePayment = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/consultation/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone, email,
          day: selectedDay,
          hour: selectedHour,
          studentName: student?.name || signatureName,
          studentId: student?.id,
          price,
          signatureName
        })
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || "Error al procesar el pago.");
      }
    } catch (e) {
      setError("Error de conexión. Inténtalo de nuevo.");
    }
    setLoading(false);
  };

  // Check if returning from Stripe
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("consultation_success") === "true") {
      setStep("done");
    }
  }, []);

  if (step === "done") {
    return (
      <div className="bg-[#0b1222] border-2 border-green-500/30 rounded-3xl p-8 text-center space-y-4">
        <div className="text-5xl">🎉</div>
        <h3 className="text-xl font-black text-white">¡Reserva Confirmada!</h3>
        <p className="text-sm text-gray-300">Hemos recibido tu pago. Te contactaremos por WhatsApp o email para confirmar tu disponibilidad exacta.</p>
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 text-sm text-amber-400">
          📞 Te llamaremos en las próximas 24 horas para confirmar el horario seleccionado: <strong>{selectedDay} a las {selectedHour} (horario español)</strong>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/5 border border-amber-500/20 rounded-3xl p-6 text-center">
        <div className="text-4xl mb-3">📞</div>
        <h2 className="text-xl font-black text-white mb-2">Consulta Personalizada con R-Consulting</h2>
        <p className="text-sm text-gray-400 mb-4">Reserva una sesión de orientación 1-a-1 por videollamada sobre estudios en España.</p>
        <div className="inline-flex items-center gap-2 bg-amber-500 text-black font-black text-lg px-6 py-2 rounded-2xl">
          💶 {price}€ / sesión
        </div>
      </div>

      {/* Steps indicator */}
      <div className="flex items-center justify-between px-4">
        {[
          { key: "info", label: "Datos", icon: "👤" },
          { key: "contract", label: "Contrato", icon: "📋" },
          { key: "calendar", label: "Horario", icon: "📅" },
          { key: "payment", label: "Pago", icon: "💳" }
        ].map((s, i) => (
          <div key={s.key} className="flex items-center">
            <div className={`flex flex-col items-center ${step === s.key ? "opacity-100" : "opacity-40"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step === s.key ? "bg-amber-500 text-black" : "bg-gray-800 text-gray-400"}`}>
                {s.icon}
              </div>
              <span className="text-[10px] text-gray-400 mt-1">{s.label}</span>
            </div>
            {i < 3 && <div className="w-8 h-px bg-gray-700 mx-2 mb-4" />}
          </div>
        ))}
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-xs text-red-400 font-medium">
          ⚠️ {error}
        </div>
      )}

      {/* Step 1: Info */}
      {step === "info" && (
        <div className="bg-[#0b1222] border border-[#1c2e4f] rounded-3xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider font-mono">👤 Tus Datos de Contacto</h3>
          <div>
            <label className="text-[10px] text-gray-400 uppercase font-mono block mb-1.5">Teléfono / WhatsApp *</label>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="+212 612 345 678"
              className="w-full bg-[#070a13] border border-[#1e293b] rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-amber-500"
            />
          </div>
          <div>
            <label className="text-[10px] text-gray-400 uppercase font-mono block mb-1.5">Correo Electrónico *</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="tu@email.com"
              className="w-full bg-[#070a13] border border-[#1e293b] rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-amber-500"
            />
          </div>
          <button onClick={handleInfoNext} className="w-full bg-amber-500 hover:bg-amber-600 text-black font-black py-3 rounded-2xl text-sm transition-all">
            Continuar →
          </button>
        </div>
      )}

      {/* Step 2: Contract */}
      {step === "contract" && (
        <div className="bg-[#0b1222] border border-[#1c2e4f] rounded-3xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider font-mono">📋 Contrato de Servicio</h3>
          
          {/* Data transfer consent */}
          <div className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-4 space-y-2">
            <h4 className="text-xs font-bold text-blue-400">🔒 Consentimiento de Transferencia de Datos</h4>
            <p className="text-xs text-gray-400">
              R-Consulting puede compartir tus datos de contacto (nombre, email, teléfono) con empresas colaboradoras que ofrezcan servicios relacionados con estudios en España (agencias de alojamiento, academias de idiomas, asesorías de visados). Esto nos permite ofrecerte oportunidades personalizadas.
            </p>
            <label className="flex items-start gap-3 cursor-pointer mt-2">
              <input
                type="checkbox"
                checked={acceptDataTransfer}
                onChange={e => setAcceptDataTransfer(e.target.checked)}
                className="mt-0.5 accent-amber-500"
              />
              <span className="text-xs text-gray-300">
                <strong className="text-white">Acepto</strong> que mis datos puedan ser transferidos a empresas colaboradoras de R-Consulting con fines de marketing y servicios relacionados con estudios en España. Puedo retirar este consentimiento en cualquier momento contactando a R-Consulting.
              </span>
            </label>
          </div>

          {/* Contract text */}
          <div className="bg-[#070a13] border border-[#1e293b] rounded-2xl p-4 h-48 overflow-y-auto">
            <pre className="text-[10px] text-gray-400 whitespace-pre-wrap font-sans leading-relaxed">{CONTRACT_TEXT}</pre>
          </div>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={acceptContract}
              onChange={e => setAcceptContract(e.target.checked)}
              className="mt-0.5 accent-amber-500"
            />
            <span className="text-xs text-gray-300">
              He leído, entendido y <strong className="text-white">acepto íntegramente</strong> el contrato de servicio de R-Consulting.
            </span>
          </label>

          <div>
            <label className="text-[10px] text-gray-400 uppercase font-mono block mb-1.5">Firma Electrónica — Escribe tu nombre completo *</label>
            <input
              type="text"
              value={signatureName}
              onChange={e => setSignatureName(e.target.value)}
              placeholder="Tu nombre completo"
              className="w-full bg-[#070a13] border border-[#1e293b] rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-amber-500 italic"
            />
            {signatureName && (
              <p className="text-xs text-gray-500 mt-1">Firmado por: <span className="text-amber-400 font-semibold italic">{signatureName}</span></p>
            )}
          </div>

          <div className="flex gap-3">
            <button onClick={() => setStep("info")} className="flex-1 bg-gray-800 text-gray-300 font-bold py-3 rounded-2xl text-sm">
              ← Volver
            </button>
            <button onClick={handleContractNext} className="flex-2 w-full bg-amber-500 hover:bg-amber-600 text-black font-black py-3 rounded-2xl text-sm transition-all">
              Aceptar y Continuar →
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Calendar */}
      {step === "calendar" && (
        <div className="bg-[#0b1222] border border-[#1c2e4f] rounded-3xl p-6 space-y-5">
          <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider font-mono">📅 Elige tu Horario</h3>
          <p className="text-xs text-gray-400">Selecciona el día y hora que prefieres (horario de España — Madrid). Te confirmaremos la disponibilidad por teléfono.</p>

          <div>
            <label className="text-[10px] text-gray-400 uppercase font-mono block mb-2">Día de la semana</label>
            <div className="grid grid-cols-4 gap-2">
              {DAYS.map(day => {
                const isBooked = HOURS.every(h => bookedSlots.includes(`${day}-${h}`));
                return (
                  <button
                    key={day}
                    onClick={() => !isBooked && setSelectedDay(day)}
                    disabled={isBooked}
                    className={`py-2 px-1 rounded-xl text-xs font-bold transition-all border ${
                      selectedDay === day
                        ? "bg-amber-500 text-black border-amber-500"
                        : isBooked
                        ? "bg-gray-900 text-gray-600 border-gray-800 cursor-not-allowed line-through"
                        : "bg-[#070a13] text-gray-300 border-[#1e293b] hover:border-amber-500"
                    }`}
                  >
                    {day.slice(0, 3)}
                  </button>
                );
              })}
            </div>
          </div>

          {selectedDay && (
            <div>
              <label className="text-[10px] text-gray-400 uppercase font-mono block mb-2">Hora (Horario España 🇪🇸)</label>
              <div className="grid grid-cols-4 gap-2">
                {HOURS.map(hour => {
                  const slot = `${selectedDay}-${hour}`;
                  const isBooked = bookedSlots.includes(slot);
                  return (
                    <button
                      key={hour}
                      onClick={() => !isBooked && setSelectedHour(hour)}
                      disabled={isBooked}
                      className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                        selectedHour === hour
                          ? "bg-amber-500 text-black border-amber-500"
                          : isBooked
                          ? "bg-gray-900 text-gray-600 border-gray-800 cursor-not-allowed"
                          : "bg-[#070a13] text-gray-300 border-[#1e293b] hover:border-amber-500"
                      }`}
                    >
                      {isBooked ? "🔒" : hour}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {selectedDay && selectedHour && (
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 text-sm text-amber-400">
              ✅ Seleccionado: <strong>{selectedDay} a las {selectedHour} (hora España)</strong>
            </div>
          )}

          <div className="flex gap-3">
            <button onClick={() => setStep("contract")} className="flex-1 bg-gray-800 text-gray-300 font-bold py-3 rounded-2xl text-sm">
              ← Volver
            </button>
            <button onClick={handleCalendarNext} className="flex-1 bg-amber-500 hover:bg-amber-600 text-black font-black py-3 rounded-2xl text-sm transition-all">
              Continuar →
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Payment */}
      {step === "payment" && (
        <div className="bg-[#0b1222] border border-[#1c2e4f] rounded-3xl p-6 space-y-5">
          <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider font-mono">💳 Resumen y Pago</h3>

          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-800">
              <span className="text-xs text-gray-400">Servicio</span>
              <span className="text-xs text-white font-bold">Consulta Personalizada R-Consulting</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-800">
              <span className="text-xs text-gray-400">Horario</span>
              <span className="text-xs text-amber-400 font-bold">{selectedDay} — {selectedHour} (España)</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-800">
              <span className="text-xs text-gray-400">Contacto</span>
              <span className="text-xs text-white">{phone} · {email}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm font-bold text-white">Total</span>
              <span className="text-xl font-black text-amber-400">{price}€</span>
            </div>
          </div>

          <div className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-4 text-xs text-blue-300">
            ℹ️ Después del pago, recibirás un email de confirmación. Te contactaremos por WhatsApp para confirmar tu horario.
          </div>

          <div className="flex gap-3">
            <button onClick={() => setStep("calendar")} className="flex-1 bg-gray-800 text-gray-300 font-bold py-3 rounded-2xl text-sm">
              ← Volver
            </button>
            <button
              onClick={handlePayment}
              disabled={loading}
              className="flex-1 bg-amber-500 hover:bg-amber-600 text-black font-black py-3 rounded-2xl text-sm transition-all disabled:opacity-60"
            >
              {loading ? "Procesando..." : `💳 Pagar ${price}€`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
