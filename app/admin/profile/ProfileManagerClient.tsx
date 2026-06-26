"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Save, User, GraduationCap, Briefcase, Heart, Edit2, X, BarChart, Lock, Mail, Image as ImageIcon } from "lucide-react";
import { updateProfile, addEducation, deleteEducation, updateEducation, addExperience, deleteExperience, updateExperience, addInterest, deleteInterest, addStat, updateStat, deleteStat } from "./actions";
import IconPicker from "@/src/components/IconPicker";
import { getAccountProfile, updateAccountProfile } from "@/src/lib/apiClient";
import MediaPicker from "../components/MediaPicker";

type ProfileData = {
  profile: any;
  educations: any[];
  experiences: any[];
  interests: any[];
  stats: any[];
};

function EducationYearInputs({ defaultValue = "", className = "admin-input text-xs p-1.5" }: { defaultValue?: string, className?: string }) {
  const adMatch = defaultValue.match(/(\d{4})\s*AD/i);
  const bsMatch = defaultValue.match(/(\d{4})\s*BS/i);
  // If no AD match but there is a 4 digit number, assume it might be BS or AD depending on value
  const genericMatch = defaultValue.match(/^(\d{4})$/);
  
  let initAd = adMatch ? adMatch[1] : "";
  let initBs = bsMatch ? bsMatch[1] : "";

  if (genericMatch && !initAd && !initBs) {
    const val = Number(genericMatch[1]);
    if (val > 2040) { initBs = String(val); initAd = String(val - 57); }
    else { initAd = String(val); initBs = String(val + 57); }
  }

  const [ad, setAd] = useState(initAd);
  const [bs, setBs] = useState(initBs);

  return (
    <div className="flex gap-2 flex-1 items-center">
      <input 
        type="number" placeholder="AD Year" className={`${className} min-w-[80px] w-full`} value={ad} required
        onChange={e => { setAd(e.target.value); if(e.target.value) setBs(String(Number(e.target.value) + 57)); }}
      />
      <span className="text-dark-400 font-bold">/</span>
      <input 
        type="number" placeholder="BS Year" className={`${className} min-w-[80px] w-full`} value={bs} required
        onChange={e => { setBs(e.target.value); if(e.target.value) setAd(String(Number(e.target.value) - 57)); }}
      />
      <input type="hidden" name="year" value={ad && bs ? `${ad} AD / ${bs} BS` : defaultValue} />
    </div>
  );
}

function ExperienceDurationInputs({ defaultValue = "", className = "admin-input text-xs p-1.5" }: { defaultValue?: string, className?: string }) {
  const adMatches = [...defaultValue.matchAll(/(\d{4})/g)];
  let initialStart = "";
  let initialEnd = "";
  
  if (adMatches.length > 0) {
    const val1 = Number(adMatches[0][1]);
    initialStart = val1 > 2040 ? String(val1 - 57) : String(val1); // Convert BS to AD if it looks like BS
  }
  if (adMatches.length > 1) {
    const val2 = Number(adMatches[1][1]);
    initialEnd = val2 > 2040 ? String(val2 - 57) : String(val2);
  }

  const [startAd, setStartAd] = useState(initialStart);
  const [endAd, setEndAd] = useState(initialEnd);
  const [isPresent, setIsPresent] = useState(defaultValue.toLowerCase().includes("present"));

  let finalStr = defaultValue;
  if (startAd) {
    const startBs = Number(startAd) + 57;
    if (isPresent) {
      finalStr = `${startAd} AD / ${startBs} BS - Present`;
    } else if (endAd) {
      const endBs = Number(endAd) + 57;
      finalStr = `${startAd}-${endAd} AD / ${startBs}-${endBs} BS`;
    } else {
      finalStr = `${startAd} AD / ${startBs} BS`;
    }
  }

  return (
    <div className="flex gap-2 flex-1 items-center">
      <input 
        type="number" placeholder="Start (AD)" className={`${className} min-w-[80px] w-full`} value={startAd} required
        onChange={e => setStartAd(e.target.value)}
      />
      <span className="text-dark-400 font-bold">-</span>
      <input 
        type="number" placeholder="End (AD)" className={`${className} min-w-[80px] w-full`} value={endAd} disabled={isPresent}
        onChange={e => setEndAd(e.target.value)}
      />
      <label className="flex items-center gap-1 text-xs text-dark-200 cursor-pointer whitespace-nowrap">
        <input type="checkbox" className="w-4 h-4" checked={isPresent} onChange={e => { setIsPresent(e.target.checked); if(e.target.checked) setEndAd(""); }} />
        Present
      </label>
      <input type="hidden" name="duration" value={finalStr} />
    </div>
  );
}

export default function ProfileManagerClient({ data }: { data: ProfileData }) {
  const [profileForm, setProfileForm] = useState({
    name: data.profile?.name || "",
    nickname: data.profile?.nickname || "",
    tagline: data.profile?.tagline || "",
    bio: data.profile?.bio || "",
    currentAddress: data.profile?.currentAddress || "",
    permanentAddress: data.profile?.permanentAddress || "",
    phone: data.profile?.phone || "",
    publicEmail: data.profile?.publicEmail || "",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [editingEduId, setEditingEduId] = useState<number | null>(null);
  const [editingExpId, setEditingExpId] = useState<number | null>(null);
  const [editingStatId, setEditingStatId] = useState<number | null>(null);

  // Account Settings State
  const [account, setAccount] = useState({ name: "", email: "", image: "", password: "", newPassword: "" });
  const [isSavingAccount, setIsSavingAccount] = useState(false);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);

  // Load account data on mount
  useEffect(() => {
    getAccountProfile().then(res => {
      if (res.success && res.data) {
        setAccount(prev => ({ ...prev, name: res.data.name || "", email: res.data.email || "", image: res.data.image || "" }));
      }
    }).catch(console.error);
  }, []);

  const handleAccountSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingAccount(true);
    try {
      const dataToUpdate: any = {
        name: account.name,
        email: account.email,
        image: account.image,
      };
      if (account.newPassword) {
        dataToUpdate.password = account.newPassword;
      }
      await updateAccountProfile(dataToUpdate);
      alert("Account updated successfully!");
      setAccount(prev => ({ ...prev, password: "", newPassword: "" }));
    } catch (err: any) {
      alert(err.message || "Failed to update account");
    } finally {
      setIsSavingAccount(false);
    }
  };

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await updateProfile(data.profile?.id, profileForm);
    setIsSaving(false);
    alert("Profile saved!");
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Profile Manager</h1>
        <p className="text-dark-200">Manage your personal information, education, experience, and interests.</p>
      </div>

      {/* ACCOUNT SETTINGS (Admin User) */}
      <div className="glass-card p-6 rounded-2xl">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
          <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Account Settings</h2>
            <p className="text-xs text-dark-300 mt-1">Update your login email, password, and admin avatar.</p>
          </div>
        </div>
        
        <form onSubmit={handleAccountSave} className="space-y-4">
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 bg-dark-900 border border-white/10 rounded-full flex items-center justify-center overflow-hidden relative group shrink-0">
              {account.image ? (
                <>
                  <img src={account.image} alt="Avatar" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      type="button"
                      onClick={() => setAccount(prev => ({ ...prev, image: '' }))}
                      className="p-1.5 bg-red-600 text-white rounded hover:bg-red-700 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </>
              ) : (
                <User className="w-8 h-8 text-dark-400" />
              )}
            </div>
            
            <div className="flex-1 space-y-4">
              <button
                type="button"
                onClick={() => setMediaPickerOpen(true)}
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm font-medium hover:bg-white/10 transition text-white"
              >
                Change Avatar
              </button>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-dark-200">Admin Name</label>
                  <input type="text" className="admin-input" required value={account.name} onChange={e => setAccount({...account, name: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-dark-200">Login Email</label>
                  <input type="email" className="admin-input" required value={account.email} onChange={e => setAccount({...account, email: e.target.value})} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/5">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-dark-200">New Password (optional)</label>
                  <input type="password" placeholder="Leave blank to keep current" className="admin-input" value={account.newPassword} onChange={e => setAccount({...account, newPassword: e.target.value})} />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button type="submit" disabled={isSavingAccount} className="btn-primary flex items-center gap-2 text-sm bg-indigo-600 hover:bg-indigo-700">
              <Save className="w-4 h-4" />
              {isSavingAccount ? "Saving..." : "Save Account"}
            </button>
          </div>
        </form>
      </div>

      <MediaPicker
        isOpen={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        onSelect={(media) => setAccount(prev => ({ ...prev, image: media.url }))}
        title="Select Avatar"
        accept="image/*"
      />

      {/* BASIC INFO (Public Profile) */}
      <div className="glass-card p-6 rounded-2xl">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
          <div className="p-2 bg-accent-500/10 rounded-lg text-accent-400">
            <User className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-white">Basic Information</h2>
        </div>
        
        <form onSubmit={handleProfileSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-dark-200">Full Name</label>
              <input type="text" className="admin-input" required value={profileForm.name} onChange={e => setProfileForm({...profileForm, name: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-dark-200">Nickname</label>
              <input type="text" className="admin-input" value={profileForm.nickname} onChange={e => setProfileForm({...profileForm, nickname: e.target.value})} />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-dark-200">Tagline / Title</label>
            <input type="text" className="admin-input" value={profileForm.tagline} onChange={e => setProfileForm({...profileForm, tagline: e.target.value})} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-dark-200">Current Address</label>
              <input type="text" className="admin-input" value={profileForm.currentAddress} onChange={e => setProfileForm({...profileForm, currentAddress: e.target.value})} placeholder="e.g. Kathmandu, Nepal" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-dark-200">Permanent Address</label>
              <input type="text" className="admin-input" value={profileForm.permanentAddress} onChange={e => setProfileForm({...profileForm, permanentAddress: e.target.value})} placeholder="e.g. Remote" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-dark-200">Phone Number</label>
              <input type="text" className="admin-input" value={profileForm.phone} onChange={e => setProfileForm({...profileForm, phone: e.target.value})} placeholder="+977..." />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-dark-200">Public Email</label>
              <input type="email" className="admin-input" value={profileForm.publicEmail} onChange={e => setProfileForm({...profileForm, publicEmail: e.target.value})} placeholder="hello@example.com" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-dark-200">Bio</label>
            <textarea className="admin-input min-h-[120px]" value={profileForm.bio} onChange={e => setProfileForm({...profileForm, bio: e.target.value})}></textarea>
          </div>
          <div className="flex justify-end pt-2">
            <button type="submit" disabled={isSaving} className="btn-primary flex items-center gap-2 text-sm">
              <Save className="w-4 h-4" />
              {isSaving ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* EDUCATION */}
        <div className="glass-card p-6 rounded-2xl flex flex-col">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-white">Education</h2>
          </div>
          
          <div className="space-y-3 mb-6 flex-1">
            {data.educations.map((edu) => (
              <div key={edu.id} className="p-3 bg-white/5 rounded-lg border border-white/5 flex justify-between items-start gap-4">
                {editingEduId === edu.id ? (
                  <form action={async (formData) => {
                    await updateEducation(edu.id, {
                      degree: formData.get("degree") as string,
                      institution: formData.get("institution") as string,
                      year: formData.get("year") as string,
                      order: Number(formData.get("order") || 0)
                    });
                    setEditingEduId(null);
                  }} className="flex-1 space-y-2">
                    <input name="degree" defaultValue={edu.degree} className="admin-input text-xs p-1.5" required />
                    <input name="institution" defaultValue={edu.institution} className="admin-input text-xs p-1.5" required />
                    <div className="flex gap-2 mt-2">
                      <EducationYearInputs defaultValue={edu.year} className="admin-input text-xs p-2" />
                    </div>
                    <div className="flex justify-end gap-2 pt-1">
                      <button type="button" onClick={() => setEditingEduId(null)} className="p-1 text-dark-300 hover:text-white rounded">
                        <X className="w-3.5 h-3.5" />
                      </button>
                      <button type="submit" className="p-1 text-accent-400 hover:text-accent-300 rounded">
                        <Save className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white text-sm">{edu.degree}</h3>
                      <p className="text-xs text-dark-200 mt-1">{edu.institution}</p>
                      <p className="text-xs text-accent-400 mt-1">{edu.year}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => setEditingEduId(edu.id)} className="p-1.5 text-dark-400 hover:text-accent-400 hover:bg-accent-400/10 rounded transition-colors">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => deleteEducation(edu.id)} className="p-1.5 text-dark-400 hover:text-red-400 hover:bg-red-400/10 rounded transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          <form action={async (formData) => {
            await addEducation({
              degree: formData.get("degree") as string,
              institution: formData.get("institution") as string,
              year: formData.get("year") as string,
              order: Number(formData.get("order") || 0)
            });
            (document.getElementById('edu-form') as HTMLFormElement).reset();
          }} id="edu-form" className="space-y-3 pt-4 border-t border-white/5">
            <input name="degree" placeholder="Degree (e.g. SLC)" className="admin-input text-sm" required />
            <input name="institution" placeholder="Institution" className="admin-input text-sm" required />
            <div className="flex gap-2 mt-1">
              <EducationYearInputs className="admin-input text-sm p-2" />
            </div>
            <button type="submit" className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium text-white transition-colors flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" /> Add Education
            </button>
          </form>
        </div>

        {/* EXPERIENCE */}
        <div className="glass-card p-6 rounded-2xl flex flex-col">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
            <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400">
              <Briefcase className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-white">Experience</h2>
          </div>
          
          <div className="space-y-3 mb-6 flex-1">
            {data.experiences.map((exp) => (
              <div key={exp.id} className="p-3 bg-white/5 rounded-lg border border-white/5 flex justify-between items-start gap-4">
                {editingExpId === exp.id ? (
                  <form action={async (formData) => {
                    await updateExperience(exp.id, {
                      role: formData.get("role") as string,
                      organization: formData.get("organization") as string,
                      duration: formData.get("duration") as string,
                      order: Number(formData.get("order") || 0)
                    });
                    setEditingExpId(null);
                  }} className="flex-1 space-y-2">
                    <input name="role" defaultValue={exp.role} className="admin-input text-xs p-1.5" required />
                    <input name="organization" defaultValue={exp.organization} className="admin-input text-xs p-1.5" required />
                    <div className="flex gap-2 mt-2">
                      <ExperienceDurationInputs defaultValue={exp.duration} className="admin-input text-xs p-2" />
                    </div>
                    <div className="flex justify-end gap-2 pt-1">
                      <button type="button" onClick={() => setEditingExpId(null)} className="p-1 text-dark-300 hover:text-white rounded">
                        <X className="w-3.5 h-3.5" />
                      </button>
                      <button type="submit" className="p-1 text-accent-400 hover:text-accent-300 rounded">
                        <Save className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white text-sm">{exp.role}</h3>
                      <p className="text-xs text-dark-200 mt-1">{exp.organization}</p>
                      <p className="text-xs text-amber-400 mt-1">{exp.duration}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => setEditingExpId(exp.id)} className="p-1.5 text-dark-400 hover:text-amber-400 hover:bg-amber-400/10 rounded transition-colors">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => deleteExperience(exp.id)} className="p-1.5 text-dark-400 hover:text-red-400 hover:bg-red-400/10 rounded transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          <form action={async (formData) => {
            await addExperience({
              role: formData.get("role") as string,
              organization: formData.get("organization") as string,
              duration: formData.get("duration") as string,
              order: Number(formData.get("order") || 0)
            });
            (document.getElementById('exp-form') as HTMLFormElement).reset();
          }} id="exp-form" className="space-y-3 pt-4 border-t border-white/5">
            <input name="role" placeholder="Role (e.g. Vet Technician)" className="admin-input text-sm" required />
            <input name="organization" placeholder="Organization" className="admin-input text-sm" required />
            <div className="flex gap-2 mt-1">
              <ExperienceDurationInputs className="admin-input text-sm p-2" />
            </div>
            <button type="submit" className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium text-white transition-colors flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" /> Add Experience
            </button>
          </form>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* STATS (Career Snapshot) */}
        <div className="glass-card p-6 rounded-2xl flex flex-col">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
            <div className="p-2 bg-teal-500/10 rounded-lg text-teal-400">
              <BarChart className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-white">Career Snapshot (Stats)</h2>
          </div>
          
          <div className="space-y-3 mb-6 flex-1">
            {data.stats.map((stat) => (
              <div key={stat.id} className="p-3 bg-white/5 rounded-lg border border-white/5 flex justify-between items-start gap-4">
                {editingStatId === stat.id ? (
                  <form action={async (formData) => {
                    await updateStat(stat.id, {
                      label: formData.get("label") as string,
                      value: formData.get("value") as string,
                      icon: formData.get("icon") as string,
                      order: Number(formData.get("order") || 0)
                    });
                    setEditingStatId(null);
                  }} className="flex-1 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <input name="label" defaultValue={stat.label} className="admin-input text-sm p-2" placeholder="Label" required />
                      <input name="value" defaultValue={stat.value} className="admin-input text-sm p-2" placeholder="Value" required />
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <IconPicker name="icon" defaultValue={stat.icon} />
                      <input name="order" type="number" defaultValue={stat.order} className="admin-input text-sm p-2" placeholder="Order" />
                    </div>
                    <div className="flex justify-end gap-2 pt-1">
                      <button type="button" onClick={() => setEditingStatId(null)} className="p-1 text-dark-300 hover:text-white rounded">
                        <X className="w-3.5 h-3.5" />
                      </button>
                      <button type="submit" className="p-1 text-accent-400 hover:text-accent-300 rounded">
                        <Save className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white text-sm">{stat.value}</h3>
                      <p className="text-xs text-dark-200 mt-1">{stat.label}</p>
                      <p className="text-xs text-teal-400 mt-1">Icon: {stat.icon}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => setEditingStatId(stat.id)} className="p-1.5 text-dark-400 hover:text-teal-400 hover:bg-teal-400/10 rounded transition-colors">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => deleteStat(stat.id)} className="p-1.5 text-dark-400 hover:text-red-400 hover:bg-red-400/10 rounded transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          <form action={async (formData) => {
            await addStat({
              label: formData.get("label") as string,
              value: formData.get("value") as string,
              icon: formData.get("icon") as string,
              order: Number(formData.get("order") || 0)
            });
            (document.getElementById('stat-form') as HTMLFormElement).reset();
          }} id="stat-form" className="space-y-3 pt-4 border-t border-white/5">
            <div className="grid grid-cols-2 gap-2">
              <input name="label" placeholder="Label (e.g. Projects Completed)" className="admin-input text-sm p-2.5" required />
              <input name="value" placeholder="Value (e.g. 1000+)" className="admin-input text-sm p-2.5" required />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <IconPicker name="icon" defaultValue="Award" />
              <input name="order" type="number" placeholder="Order (Priority)" className="admin-input text-sm p-2.5" defaultValue="0" />
            </div>
            <button type="submit" className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium text-white transition-colors flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" /> Add Stat
            </button>
          </form>
        </div>

      {/* INTERESTS */}
      <div className="glass-card p-6 rounded-2xl">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
          <div className="p-2 bg-rose-500/10 rounded-lg text-rose-400">
            <Heart className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-white">Interests & Hobbies</h2>
        </div>
        
        <div className="flex flex-wrap gap-3 mb-6">
          {data.interests.map((int) => (
            <div key={int.id} className="px-3 py-1.5 bg-white/5 rounded-full border border-white/10 flex items-center gap-2">
              <span className="text-sm text-white">{int.name}</span>
              {int.category && <span className="text-xs text-dark-300">({int.category})</span>}
              <button onClick={() => deleteInterest(int.id)} className="text-dark-400 hover:text-red-400 ml-1">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        <form action={async (formData) => {
          await addInterest({
            name: formData.get("name") as string,
            category: formData.get("category") as string,
          });
          (document.getElementById('int-form') as HTMLFormElement).reset();
        }} id="int-form" className="flex gap-3 items-end max-w-xl border-t border-white/5 pt-4">
          <div className="flex-1 space-y-1">
            <input name="name" placeholder="Interest (e.g. Literature)" className="admin-input text-sm" required />
          </div>
          <div className="flex-1 space-y-1">
            <input name="category" placeholder="Category (e.g. Reading)" className="admin-input text-sm" />
          </div>
          <button type="submit" className="px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium text-white transition-colors flex items-center gap-2 shrink-0">
            <Plus className="w-4 h-4" /> Add
          </button>
        </form>
      </div>
      </div>

    </div>
  );
}
