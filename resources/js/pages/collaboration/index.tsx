import { Head, usePage, useForm, Link } from '@inertiajs/react';
import { UpgradeModal } from '@/components/shared/upgrade-modal';
import { useState } from 'react';
import { FiUsers, FiPlus, FiChevronRight, FiLock, FiCheck, FiX } from 'react-icons/fi';
import { FaFire } from 'react-icons/fa6';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const PLAN_FEATURES = {
    free: {
        label: '🆓 Gratis',
        color: 'text-text-muted',
        bgColor: 'bg-card',
        features: [
            { ok: false, text: 'Buat ruang kerja' },
            { ok: false, text: 'Undang anggota tim' },
            { ok: false, text: 'Bergabung via undangan' },
        ],
    },
    pro: {
        label: '⭐ Pro',
        color: 'text-warning',
        bgColor: 'bg-warning/10',
        features: [
            { ok: true,  text: '1 ruang kerja (solo)' },
            { ok: false, text: 'Undang anggota tim' },
            { ok: true,  text: 'Bergabung via undangan' },
            { ok: true,  text: 'Maks 3 kolom per workspace' },
            { ok: true,  text: 'Maks 10 kartu per kolom' },
        ],
    },
    max: {
        label: '💎 Max',
        color: 'text-primary',
        bgColor: 'bg-primary/10',
        features: [
            { ok: true, text: 'Ruang kerja tak terbatas' },
            { ok: true, text: 'Undang anggota tim' },
            { ok: true, text: 'Bergabung via undangan' },
            { ok: true, text: 'Kolom tak terbatas' },
            { ok: true, text: 'Kartu tak terbatas' },
        ],
    },
};

export default function CollaborationIndex() {
    const { auth, workspaces = [] } = usePage().props as any;
    const isMax = auth?.user?.isMax ?? false;
    const isPro = auth?.user?.isPro ?? false;
    const isFree = !isPro && !isMax;
    const canCreateWorkspace = auth?.limits?.canCreateWorkspace ?? false;

    const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
    const [upgradeTitle, setUpgradeTitle] = useState('');
    const [upgradeDescription, setUpgradeDescription] = useState('');
    const [createModalOpen, setCreateModalOpen] = useState(false);

    const { data, setData, post, processing, reset, errors } = useForm({
        name: '',
        description: '',
    });

    const showUpgrade = (title: string, desc: string) => {
        setUpgradeTitle(title);
        setUpgradeDescription(desc);
        setUpgradeModalOpen(true);
    };

    const handleCreateClick = () => {
        if (isFree) {
            showUpgrade(
                'Fitur Kolaborasi (Pro & Max)',
                'Paket Gratis tidak bisa membuat ruang kerja. Upgrade ke Pro untuk membuat 1 ruang kerja solo, atau ke Max untuk kolaborasi tim penuh dengan undangan anggota!'
            );
        } else if (!canCreateWorkspace) {
            showUpgrade(
                'Batas Ruang Kerja Tercapai (Pro)',
                'Paket Pro hanya mendukung 1 ruang kerja. Upgrade ke Max untuk membuat ruang kerja tak terbatas dan mengundang anggota tim!'
            );
        } else {
            setCreateModalOpen(true);
        }
    };

    const submitCreate = (e: React.FormEvent) => {
        e.preventDefault();
        post('/collaboration', {
            onSuccess: () => {
                setCreateModalOpen(false);
                reset();
            },
        });
    };

    const currentPlan = isMax ? 'max' : isPro ? 'pro' : 'free';
    const planInfo = PLAN_FEATURES[currentPlan];

    return (
        <>
            <Head title="Kolaborasi Tim" />

            <div className="p-8 w-full max-w-6xl mx-auto">
                {/* Header Utama */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
                            <FiUsers className="text-primary" /> Kolaborasi Tim
                        </h1>
                        <p className="text-text-muted text-sm">Kelola proyek bersama tim layaknya menggunakan Trello.</p>
                    </div>
                    <button
                        onClick={handleCreateClick}
                        className="bg-primary border-b-4 border-b-[#C4500D] text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all active:translate-y-[2px] active:border-b-[1px]"
                    >
                        <FiPlus /> Buat Ruang Kerja
                    </button>
                </div>

                {/* Banner Plan — hanya tampil jika bukan Max */}
                {!isMax && (
                    <div className={`${planInfo.bgColor} border border-border rounded-2xl p-5 mb-8 flex flex-col sm:flex-row sm:items-center gap-4`}>
                        <div className="flex-1">
                            <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1">Paket Aktifmu</p>
                            <p className={`text-lg font-bold ${planInfo.color}`}>{planInfo.label}</p>
                            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                                {planInfo.features.map((f, i) => (
                                    <span key={i} className={`text-xs flex items-center gap-1 ${f.ok ? 'text-text-muted' : 'text-text-faint line-through'}`}>
                                        {f.ok ? <FiCheck className="text-success flex-shrink-0" size={11} /> : <FiX className="text-danger flex-shrink-0" size={11} />}
                                        {f.text}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <Link
                            href="/pricing"
                            className="bg-primary border-b-4 border-b-[#C4500D] text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 text-sm transition-all active:translate-y-[2px] active:border-b-[1px] whitespace-nowrap"
                        >
                            <FaFire /> {isPro ? 'Upgrade ke Max' : 'Upgrade Sekarang'}
                        </Link>
                    </div>
                )}

                {/* List Ruang Kerja */}
                {workspaces.length === 0 ? (
                    <div className="text-center py-16 bg-surface border border-border rounded-2xl">
                        <FiUsers className="mx-auto h-12 w-12 text-text-muted mb-4" />
                        <h3 className="text-lg font-bold text-white mb-2">Belum ada ruang kerja</h3>
                        <p className="text-text-muted text-sm mb-6">
                            {isFree ? 'Upgrade ke Pro atau Max untuk mulai berkolaborasi.' : 'Mulai berkolaborasi dengan membuat ruang kerja pertamamu.'}
                        </p>
                        <Button onClick={handleCreateClick} className="bg-primary hover:bg-[#FF8C42] text-white rounded-lg">
                            {isFree ? <><FiLock className="mr-2" /> Upgrade untuk Mulai</> : <><FiPlus className="mr-2" /> Buat Ruang Kerja</>}
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {workspaces.map((ws: any) => (
                            <Link
                                href={`/collaboration/${ws.id}`}
                                key={ws.id}
                                className="bg-surface border border-border border-b-4 border-b-[#0A0A0A] rounded-2xl p-5 block transition-all hover:border-primary/50 active:translate-y-[2px] active:border-b-[1px] group"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-bold text-white text-lg group-hover:text-primary transition-colors">{ws.name}</h3>
                                    <FiChevronRight className="text-text-muted group-hover:text-primary transition-colors" />
                                </div>
                                <p className="text-sm text-text-muted mb-4 line-clamp-2">{ws.description || 'Tidak ada deskripsi'}</p>
                                <div className="flex items-center gap-4 text-xs font-medium text-text-muted">
                                    <span className="flex items-center gap-1.5"><FiUsers /> {ws.members_count} anggota</span>
                                    <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-primary inline-block"></span> {ws.tasks_count} tugas</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {/* Create Workspace Modal */}
            {createModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-surface border border-border rounded-2xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200">
                        <h2 className="text-xl font-bold text-white mb-1">Buat Ruang Kerja Baru</h2>
                        {isPro && !isMax && (
                            <p className="text-xs text-warning mb-4 bg-warning/10 border border-warning/20 rounded-lg px-3 py-2">
                                ⭐ Paket Pro: 1 ruang kerja, maks 3 kolom & 10 kartu per kolom. Upgrade ke Max untuk tak terbatas + undang anggota.
                            </p>
                        )}
                        <form onSubmit={submitCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-text-muted mb-1">Nama Ruang Kerja</label>
                                <Input
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    className="bg-card border-border text-white"
                                    placeholder="Misi Rahasia 2026"
                                    autoFocus
                                    required
                                />
                                {errors.name && <p className="text-danger text-xs mt-1">{errors.name}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-muted mb-1">Deskripsi (opsional)</label>
                                <Input
                                    value={data.description}
                                    onChange={e => setData('description', e.target.value)}
                                    className="bg-card border-border text-white"
                                    placeholder="Ruang kerja untuk project X..."
                                />
                            </div>
                            <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-border">
                                <Button type="button" variant="ghost" onClick={() => setCreateModalOpen(false)} className="text-text-muted hover:text-white">
                                    Batal
                                </Button>
                                <Button type="submit" disabled={processing} className="bg-primary hover:bg-[#FF8C42] text-white rounded-lg">
                                    {processing ? 'Menyimpan...' : 'Buat Ruang Kerja'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <UpgradeModal
                open={upgradeModalOpen}
                onClose={() => setUpgradeModalOpen(false)}
                title={upgradeTitle}
                description={upgradeDescription}
            />
        </>
    );
}
