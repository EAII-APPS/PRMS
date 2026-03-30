import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Typography,
} from "@material-tailwind/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faVolumeHigh } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import axiosInstance from "../GlobalContexts/Base_url";
import Countdown from "./Countdown";
import ReminderCard from "./ReminderCard";

const HIDE_KEY = "hideComponent";
const SOUND_KEY = "reminderSoundEnabled";
const SOUND_PROMPT_DISMISSED_KEY = "reminderSoundPromptDismissed";

function safeFirst(items) {
  return Array.isArray(items) && items.length > 0 ? items[0] : null;
}

function getTimeMs(value) {
  const time = new Date(value).getTime();
  return Number.isFinite(time) ? time : null;
}

function playBeep(audioContextRef) {
  const AudioContextImpl = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextImpl) throw new Error("AudioContext not supported");

  if (!audioContextRef.current) {
    audioContextRef.current = new AudioContextImpl();
  }
  const audioContext = audioContextRef.current;

  if (audioContext.state === "suspended") {
    return audioContext.resume().then(() => playBeep(audioContextRef));
  }

  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();

  oscillator.type = "sine";
  oscillator.frequency.value = 880;
  gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.2, audioContext.currentTime + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.35);

  oscillator.connect(gain);
  gain.connect(audioContext.destination);

  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.4);
}

export default function ReminderDropdown() {
  const { t } = useTranslation();

  const [user, setUser] = useState(null);
  const [sectorReminder, setSectorReminder] = useState(null);
  const [divisionReminder, setDivisionReminder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [openCreate, setOpenCreate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [refreshNonce, setRefreshNonce] = useState(0);

  const reminderRef = useRef(null);
  const audioContextRef = useRef(null);

  const [isHidden, setIsHidden] = useState(() => {
    const stored = localStorage.getItem(HIDE_KEY);
    if (stored === null) return true; // hidden by default
    return stored === "true";
  });
  const [soundEnabled, setSoundEnabled] = useState(localStorage.getItem(SOUND_KEY) === "true");
  const [soundPromptDismissed, setSoundPromptDismissed] = useState(
    localStorage.getItem(SOUND_PROMPT_DISMISSED_KEY) === "true"
  );

  useEffect(() => {
    if (localStorage.getItem(HIDE_KEY) === null) {
      localStorage.setItem(HIDE_KEY, "true");
      window.dispatchEvent(new Event("storage"));
    }
  }, []);

  const sectorDate = sectorReminder?.submision_dateof_sector ?? null;
  const divisionDate = divisionReminder?.submision_dateof_division ?? null;

  const isSectorExpired = useMemo(() => {
    const time = getTimeMs(sectorDate);
    return time !== null ? time <= Date.now() : false;
  }, [sectorDate]);

  const isDivisionExpired = useMemo(() => {
    const time = getTimeMs(divisionDate);
    return time !== null ? time <= Date.now() : false;
  }, [divisionDate]);

  const hasExpiredReminder = isSectorExpired || isDivisionExpired;

  const canManageSectorReminder = Boolean(user?.monitoring_id);
  const canManageDivisionReminder = Boolean(user?.sector_id && !user?.monitoring_id);
  const canManageAny = canManageSectorReminder || canManageDivisionReminder;

  const displayedReminders = useMemo(() => {
    if (!user) return [];
    if (user.monitoring_id) return [{ kind: "sector", reminder: sectorReminder }];
    if (user.sector_id && !user.division_id) {
      return [
        { kind: "sector", reminder: sectorReminder },
        { kind: "division", reminder: divisionReminder },
      ];
    }
    if (user.division_id) return [{ kind: "division", reminder: divisionReminder }];
    return [{ kind: "sector", reminder: sectorReminder }, { kind: "division", reminder: divisionReminder }];
  }, [user, sectorReminder, divisionReminder]);

  const hasAnyDisplayedReminder = displayedReminders.some((r) => Boolean(r.reminder));

  useEffect(() => {
    const handleStorageChange = () => {
      setIsHidden(localStorage.getItem(HIDE_KEY) === "true");
      setSoundEnabled(localStorage.getItem(SOUND_KEY) === "true");
      setSoundPromptDismissed(localStorage.getItem(SOUND_PROMPT_DISMISSED_KEY) === "true");
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (reminderRef.current && !reminderRef.current.contains(event.target)) {
        localStorage.setItem(HIDE_KEY, "true");
        setIsHidden(true);
        window.dispatchEvent(new Event("storage"));
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const fetchReminders = async () => {
      setLoading(true);
      setError(null);
      try {
        const meRes = await axiosInstance.get("userApp/me/");
        if (cancelled) return;
        const me = meRes.data;
        setUser(me);

        const requests = [];
        if (me.monitoring_id || (me.sector_id && !me.division_id)) {
          requests.push(
            axiosInstance.get("userApp/sector_reminders/").then((r) => ({ key: "sector", value: safeFirst(r.data) }))
          );
        }
        if (me.division_id || me.sector_id || (!me.monitoring_id && !me.sector_id && !me.division_id)) {
          requests.push(
            axiosInstance
              .get("userApp/division_reminders/")
              .then((r) => ({ key: "division", value: safeFirst(r.data) }))
          );
        }

        const results = await Promise.all(requests);
        if (cancelled) return;
        const next = Object.fromEntries(results.map((r) => [r.key, r.value]));
        setSectorReminder(next.sector ?? null);
        setDivisionReminder(next.division ?? null);
      } catch (e) {
        if (cancelled) return;
        setError(e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchReminders();
    return () => {
      cancelled = true;
    };
  }, [refreshNonce]);

  useEffect(() => {
    const id = window.setInterval(() => setRefreshNonce((n) => n + 1), 60_000);
    return () => window.clearInterval(id);
  }, []);

  const handleOpenCreate = () => setOpenCreate((v) => !v);
  const handleOpenDelete = () => setOpenDelete((v) => !v);

  const handleCreate = async (title, nextSectorDate, nextDivisionDate) => {
    try {
      if (canManageSectorReminder) {
        await axiosInstance.post("userApp/sector_reminders/", { title, submision_dateof_sector: nextSectorDate });
      } else if (canManageDivisionReminder) {
        await axiosInstance.post("userApp/division_reminders/", {
          title,
          submision_dateof_division: nextDivisionDate,
        });
      }
      setOpenCreate(false);
      setRefreshNonce((n) => n + 1);
    } catch (e) {
      setError(e);
    }
  };

  const handleDelete = async () => {
    try {
      if (canManageSectorReminder) {
        await axiosInstance.delete("userApp/sector_reminders/latest/");
      } else if (canManageDivisionReminder) {
        await axiosInstance.delete("userApp/division_reminders/latest/");
      }
      setOpenDelete(false);
      setRefreshNonce((n) => n + 1);
    } catch (e) {
      setError(e);
    }
  };

  const enableSound = async () => {
    try {
      localStorage.setItem(SOUND_KEY, "true");
      setSoundEnabled(true);
      playBeep(audioContextRef);
    } catch (e) {
      setError(e);
    }
  };

  const dismissSoundPrompt = () => {
    localStorage.setItem(SOUND_PROMPT_DISMISSED_KEY, "true");
    setSoundPromptDismissed(true);
  };

  const lastAlertKeyRef = useRef(null);
  useEffect(() => {
    if (!soundEnabled) return;
    if (!hasExpiredReminder) return;

    const sectorKey = sectorReminder ? `sector:${sectorReminder.id}:${isSectorExpired}` : null;
    const divisionKey = divisionReminder ? `division:${divisionReminder.id}:${isDivisionExpired}` : null;
    const nextKey = [sectorKey, divisionKey].filter(Boolean).join("|");
    if (!nextKey) return;

    if (lastAlertKeyRef.current !== nextKey) {
      lastAlertKeyRef.current = nextKey;
      try {
        playBeep(audioContextRef);
      } catch {
        localStorage.setItem(SOUND_KEY, "false");
        setSoundEnabled(false);
      }
    }
  }, [soundEnabled, hasExpiredReminder, isSectorExpired, isDivisionExpired, sectorReminder, divisionReminder]);

  if (isHidden) return null;

  return (
    <>
      <div ref={reminderRef} className="fixed top-16 right-5 w-[350px] z-50 transition-all duration-500">
        <Card className="shadow-2xl rounded-2xl bg-white/90 backdrop-blur-md border border-white/20 p-4">
          <div className="flex flex-col gap-4">
            <CardBody className="p-2">
              {loading ? (
                <Typography variant="small" className="text-center py-4 font-bold text-blue-gray-400">
                  {t("MAIN.LOADING", "Loading...")}
                </Typography>
              ) : error ? (
                <div className="space-y-2">
                  <Typography variant="small" className="text-center py-3 font-bold text-red-500 bg-red-50/50 rounded-xl">
                    {t("MAIN.ERROR", "Something went wrong.")}
                  </Typography>
                  <div className="flex justify-center">
                    <Button size="sm" variant="text" onClick={() => setRefreshNonce((n) => n + 1)} className="normal-case">
                      {t("MAIN.RETRY", "Retry")}
                    </Button>
                  </div>
                </div>
              ) : !hasAnyDisplayedReminder ? (
                <Typography
                  variant="small"
                  className="text-center py-4 font-bold text-blue-gray-500 bg-blue-gray-50/60 rounded-xl border border-blue-gray-100"
                >
                  {t("MAIN.DASHBOARD_PAGE.NO_REMINDERS_YET", "No reminders yet.")}
                </Typography>
              ) : (
                <div className="space-y-4">
                  {displayedReminders.map(({ kind, reminder }) => {
                    if (!reminder) return null;
                    const label =
                      kind === "sector"
                        ? t("MAIN.REMINDERS.SECTOR", "Sector Reminder")
                        : t("MAIN.REMINDERS.DIVISION", "Division Reminder");
                    const dateValue =
                      kind === "sector" ? reminder.submision_dateof_sector : reminder.submision_dateof_division;
                    return (
                      <div key={`${kind}:${reminder.id}`}>
                        {displayedReminders.length > 1 && (
                          <Typography variant="small" className="font-bold uppercase tracking-wider text-blue-gray-400 mb-1">
                            {label}
                          </Typography>
                        )}
                        <Typography variant="h6" color="blue-gray" className="font-bold flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                          {reminder.title}
                        </Typography>
                        <Countdown sectorDate={kind === "sector" ? dateValue : null} divisionDate={kind === "division" ? dateValue : null} />
                      </div>
                    );
                  })}

                  {hasExpiredReminder && !soundEnabled && !soundPromptDismissed && (
                    <div className="p-3 rounded-xl border border-amber-100 bg-amber-50/60 space-y-2">
                      <Typography variant="small" className="font-bold text-amber-900">
                        {t("MAIN.REMINDERS.SOUND_PROMPT", "Enable a sound alert for active reminders?")}
                      </Typography>
                      <div className="flex gap-2">
                        <Button size="sm" variant="gradient" color="amber" onClick={enableSound} className="flex items-center gap-2 normal-case">
                          <FontAwesomeIcon icon={faVolumeHigh} />
                          {t("MAIN.REMINDERS.ENABLE_SOUND", "Enable sound")}
                        </Button>
                        <Button size="sm" variant="text" onClick={dismissSoundPrompt} className="normal-case">
                          {t("MAIN.REMINDERS.NOT_NOW", "Not now")}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardBody>

            <CardFooter className="p-0 flex gap-2 pt-2 border-t border-gray-100">
              {canManageAny && (
                <>
                  <Button size="sm" variant="gradient" color="blue" fullWidth onClick={handleOpenCreate} className="normal-case">
                    {t("MAIN.DASHBOARD_PAGE.CREATE_NEW")}
                  </Button>
                  {(sectorReminder || divisionReminder) && (
                    <Button size="sm" variant="text" color="red" onClick={handleOpenDelete} className="normal-case">
                      {t("MAIN.DASHBOARD_PAGE.DELETE")}
                    </Button>
                  )}
                </>
              )}
            </CardFooter>
          </div>
        </Card>
      </div>

      <Dialog open={openCreate} handler={handleOpenCreate} size="sm" className="rounded-2xl">
        <DialogBody className="p-0">
          <ReminderCard onSave={handleCreate} onClose={handleOpenCreate} user={user} />
        </DialogBody>
      </Dialog>

      <Dialog open={openDelete} handler={handleOpenDelete} size="xs" className="rounded-2xl">
        <DialogHeader className="flex flex-col items-center gap-2 pt-8">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-500 mb-2">
            <FontAwesomeIcon icon={faTimes} className="text-xl" />
          </div>
          <Typography variant="h5" color="blue-gray" className="text-center font-bold px-4">
            {t("MAIN.DASHBOARD_PAGE.DELETE_CONFIRMATION")}
          </Typography>
        </DialogHeader>
        <DialogFooter className="flex gap-3 justify-center items-center pb-8 pt-4">
          <Button variant="text" size="md" color="blue-gray" onClick={handleOpenDelete} className="normal-case font-bold">
            {t("MAIN.DASHBOARD_PAGE.NO")}
          </Button>
          <Button variant="gradient" size="md" color="red" onClick={handleDelete} className="normal-case font-bold shadow-red-200">
            {t("MAIN.DASHBOARD_PAGE.YES")}
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}
