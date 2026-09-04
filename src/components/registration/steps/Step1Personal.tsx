"use client";
import { useLanguage } from "@/context/LanguageContext";
import FormField from "../fields/FormField";
import SearchableSelect from "../fields/SearchableSelect";
import RadioCards from "../fields/RadioCards";
import type { PersonalData } from "@/types/registration";
import Image from "next/image";
import { User, UserRound } from "lucide-react";

const SAUDI_CITIES = [
  "الرياض","جدة","مكة المكرمة","المدينة المنورة","الدمام","الخبر","الظهران","الطائف","تبوك","بريدة",
  "حائل","الجبيل","الخرج","الأحساء","الجوف","نجران","جازان","ينبع","أبها","عرعر","القطيف",
  "سكاكا","صبيا","خميس مشيط","الباحة","بيشة","الوجه","شرورة","القنفذة","رابغ","أخرى",
];

const SAUDI_CITIES_EN = [
  "Riyadh","Jeddah","Makkah","Madinah","Dammam","Khobar","Dhahran","Taif","Tabuk","Buraidah",
  "Hail","Jubail","Al Kharj","Al-Ahsa","Al Jouf","Najran","Jizan","Yanbu","Abha","Arar","Qatif",
  "Sakaka","Sabya","Khamis Mushait","Al Baha","Bisha","Al Wajh","Sharurah","Al Qunfudhah","Rabigh","Other",
];

interface Props {
  data: PersonalData;
  onChange: (data: PersonalData) => void;
  errors: Partial<Record<keyof PersonalData, string>>;
}

export default function Step1Personal({ data, onChange, errors }: Props) {
  const { locale } = useLanguage();
  const ar = locale === "ar";

  function set<K extends keyof PersonalData>(key: K, val: PersonalData[K]) {
    onChange({ ...data, [key]: val });
  }

  const cities = ar ? SAUDI_CITIES : SAUDI_CITIES_EN;

  const statusOptions = ar
    ? [
        { value: "student", label: "طالب/ـة جامعي/ـة" },
        { value: "graduate", label: "خريج/ـة" },
        { value: "employed", label: "موظف/ـة" },
        { value: "job_seeker", label: "باحث/ـة عن عمل" },
        { value: "other", label: "أخرى" },
      ]
    : [
        { value: "student", label: "University Student" },
        { value: "graduate", label: "Graduate" },
        { value: "employed", label: "Employed" },
        { value: "job_seeker", label: "Job Seeker" },
        { value: "other", label: "Other" },
      ];

  return (
    <div className="reg-step">
      <div className="reg-step-header">
        <Image src="/assets/characters/char-ready.png" alt="" width={72} height={72} className="reg-step-char" />
        <div>
          <h2 className="reg-step-title">{ar ? "البيانات الشخصية" : "Personal Information"}</h2>
          <p className="reg-step-subtitle">{ar ? "أدخل بياناتك الشخصية بدقة." : "Please enter your personal details accurately."}</p>
        </div>
      </div>

      <div className="reg-fields-grid">
        {/* Full name */}
        <FormField label={ar ? "الاسم الثلاثي" : "Full Name"} required hint={ar ? "يرجى كتابة الاسم بشكل صحيح وكامل." : "Please enter your full name accurately."} error={errors.full_name} htmlFor="full_name" className="col-span-2">
          <input id="full_name" type="text" value={data.full_name} onChange={(e) => set("full_name", e.target.value)} className={`reg-input ${errors.full_name ? "reg-input--error" : ""}`} maxLength={150} autoComplete="name" />
        </FormField>

        {/* Birth date */}
        <FormField label={ar ? "تاريخ الميلاد" : "Date of Birth"} required error={errors.birth_date} htmlFor="birth_date">
          <input id="birth_date" type="date" value={data.birth_date} onChange={(e) => set("birth_date", e.target.value)} max={new Date().toISOString().split("T")[0]} className={`reg-input ${errors.birth_date ? "reg-input--error" : ""}`} />
        </FormField>

        {/* Gender */}
        <div className="col-span-2">
          <FormField
            label={ar ? "الجنس" : "Gender"}
            required
            hint={
              ar
                ? "اختر الجنس كما هو مسجل في بياناتك الرسمية. يُستخدم هذا الحقل لأغراض تنظيم المشاركين وتكوين الفرق."
                : "Select your gender as registered in your official documents. Used for organizing participants and team formation."
            }
            error={errors.gender}
            htmlFor="gender"
          >
            <div
              id="gender"
              className="grid grid-cols-1 sm:grid-cols-2 gap-3"
              role="radiogroup"
              aria-label={ar ? "الجنس" : "Gender"}
            >
              {[
                { value: "male" as const, label: ar ? "ذكر" : "Male", icon: User },
                { value: "female" as const, label: ar ? "أنثى" : "Female", icon: UserRound },
              ].map((opt) => {
                const isSelected = data.gender === opt.value;
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => set("gender", opt.value)}
                    className={`relative flex items-center justify-between p-4 rounded-2xl border transition-all text-right cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c3f937] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0c1018] ${
                      isSelected
                        ? "border-[#c3f937] bg-[#c3f937]/10 shadow-[0_0_20px_-3px_rgba(195,249,55,0.25)] text-white"
                        : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04] text-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                          isSelected
                            ? "bg-[#c3f937] text-[#0c1018]"
                            : "bg-white/5 text-slate-400 group-hover:text-white group-hover:bg-white/10"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="font-bold text-base sm:text-lg">
                        {opt.label}
                      </span>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                        isSelected
                          ? "border-[#c3f937] bg-[#c3f937]"
                          : "border-white/30 bg-transparent group-hover:border-white/50"
                      }`}
                      aria-hidden="true"
                    >
                      {isSelected && <div className="w-2 h-2 rounded-full bg-[#0c1018]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </FormField>
        </div>

        {/* Phone */}
        <FormField label={ar ? "رقم الجوال" : "Mobile Number"} required hint={ar ? "يرجى إدخال رقم جوال فعّال، حيث سيتم استخدامه للتواصل عبر WhatsApp." : "Enter a valid Saudi mobile number for WhatsApp contact."} error={errors.phone} htmlFor="phone">
          <input id="phone" type="tel" value={data.phone} onChange={(e) => set("phone", e.target.value)} placeholder={ar ? "05xxxxxxxx" : "+9665xxxxxxxx"} className={`reg-input ${errors.phone ? "reg-input--error" : ""}`} inputMode="tel" dir="ltr" />
        </FormField>

        {/* Email */}
        <FormField label={ar ? "البريد الإلكتروني" : "Email"} required hint={ar ? "يرجى إدخال بريد إلكتروني فعّال، حيث سيتم استخدامه في التواصل المتعلق بالقبول والمعسكر." : "Enter a valid email address for camp-related communications."} error={errors.email} htmlFor="email">
          <input id="email" type="email" value={data.email} onChange={(e) => set("email", e.target.value.toLowerCase())} className={`reg-input ${errors.email ? "reg-input--error" : ""}`} autoComplete="email" dir="ltr" />
        </FormField>

        {/* Email confirm */}
        <FormField label={ar ? "تأكيد البريد الإلكتروني" : "Confirm Email"} required hint={ar ? "أعد إدخال بريدك الإلكتروني للتأكد من صحته." : "Re-enter your email address to confirm."} error={errors.email_confirm} htmlFor="email_confirm">
          <input id="email_confirm" type="email" value={data.email_confirm} onChange={(e) => set("email_confirm", e.target.value.toLowerCase())} className={`reg-input ${errors.email_confirm ? "reg-input--error" : ""}`} autoComplete="off" dir="ltr" />
        </FormField>

        {/* City */}
        <FormField label={ar ? "المدينة" : "City"} required error={errors.city} htmlFor="city">
          <SearchableSelect
            id="city"
            value={data.city}
            onChange={(v) => {
              const isOther = v === (ar ? "أخرى" : "Other");
              onChange({
                ...data,
                city: v,
                city_other: isOther ? data.city_other : "",
              });
            }}
            options={cities}
            placeholder={ar ? "اختر مدينتك..." : "Select your city..."}
            error={undefined}
          />
        </FormField>

        {/* City other */}
        {(data.city === "أخرى" || data.city === "Other") && (
          <FormField label={ar ? "اكتب اسم مدينتك" : "Enter your city"} required error={errors.city_other} htmlFor="city_other">
            <input id="city_other" type="text" value={data.city_other} onChange={(e) => set("city_other", e.target.value)} className={`reg-input ${errors.city_other ? "reg-input--error" : ""}`} maxLength={100} />
          </FormField>
        )}

        {/* Organization */}
        <FormField label={ar ? "جهة الدراسة أو العمل" : "University / Employer"} required hint={ar ? "اكتب اسم الجامعة، الجهة التعليمية، أو جهة العمل الحالية." : "Write the name of your university or employer."} error={errors.organization} htmlFor="organization" className="col-span-2">
          <input id="organization" type="text" value={data.organization} onChange={(e) => set("organization", e.target.value)} className={`reg-input ${errors.organization ? "reg-input--error" : ""}`} maxLength={200} />
        </FormField>

        {/* Specialization */}
        <FormField label={ar ? "التخصص أو المجال" : "Specialization / Field"} required hint={ar ? "اكتب تخصصك الدراسي أو مجال عملك الحالي." : "Write your academic major or current field of work."} error={errors.specialization} htmlFor="specialization" className="col-span-2">
          <input id="specialization" type="text" value={data.specialization} onChange={(e) => set("specialization", e.target.value)} className={`reg-input ${errors.specialization ? "reg-input--error" : ""}`} maxLength={200} />
        </FormField>

        {/* Current status */}
        <div className="col-span-2">
          <FormField label={ar ? "حالتك الحالية" : "Current Status"} required error={errors.current_status}>
            <RadioCards
              name="current_status"
              value={data.current_status}
              options={statusOptions}
              onChange={(v) => {
                const nextStatus = v as PersonalData["current_status"];
                onChange({
                  ...data,
                  current_status: nextStatus,
                  current_status_other: nextStatus === "other" ? data.current_status_other : "",
                });
              }}
            />
          </FormField>
          {data.current_status === "other" && (
            <FormField label={ar ? "حدد حالتك" : "Specify your status"} required error={errors.current_status_other} htmlFor="current_status_other" className="mt-3">
              <input id="current_status_other" type="text" value={data.current_status_other} onChange={(e) => set("current_status_other", e.target.value)} className={`reg-input ${errors.current_status_other ? "reg-input--error" : ""}`} maxLength={200} />
            </FormField>
          )}
        </div>
      </div>
    </div>
  );
}
