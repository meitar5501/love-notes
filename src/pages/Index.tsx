import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart, Sparkles, ArrowRight, CheckCircle2, Settings, RotateCcw, Eye, EyeOff, Download } from "lucide-react";

interface LoveNote {
  id: number;
  title: string;
  message: string;
  emoji: string;
  image: string;
}

interface NoteIndex {
  id: number;
  filename: string;
}

// Parse a note file content
const parseNoteFile = (content: string, id: number): LoveNote => {
  const lines = content.split('\n');
  let title = '';
  let emoji = '';
  let message = '';
  let image = ''; // שדה חדש לתמונה
  let currentSection = '';

  for (const line of lines) {
    if (line.startsWith('Title:')) {
      title = line.replace('Title:', '').trim();
    } else if (line.startsWith('Emoji:')) {
      emoji = line.replace('Emoji:', '').trim();
    } else if (line.startsWith('Image:')) {
      image = line.replace('Image:', '').trim(); // אחסון נתיב/URL לתמונה
    } else if (line.startsWith('Message:')) {
      currentSection = 'message';
    } else if (currentSection === 'message' && line.trim()) {
      message += (message ? '\n' : '') + line;
    }
  }

  return {
    id,
    title: title || `Note ${id}`,
    emoji: emoji || '💕',
    image: image || '', // ברירת מחדל ריקה
    message: message.trim() || ''
  };
};

// Admin password - change this to your desired admin password
const ADMIN_PASSWORD = "admin123"; // You can change this password

const Index = () => {
  const [selectedNote, setSelectedNote] = useState<LoveNote | null>(null);
  const [isOpening, setIsOpening] = useState(false);
  const [openedNotes, setOpenedNotes] = useState<Set<number>>(new Set());
  const [isAdminDialogOpen, setIsAdminDialogOpen] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [adminError, setAdminError] = useState("");
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [loveNotes, setLoveNotes] = useState<LoveNote[]>([]);
  const [isLoadingNotes, setIsLoadingNotes] = useState(true);

  // Load notes from files
  useEffect(() => {
    const loadNotes = async () => {
      try {
        setIsLoadingNotes(true);
        // Load the index file
        const indexResponse = await fetch('/notes/index.json');
        if (!indexResponse.ok) {
          throw new Error('Failed to load notes index');
        }
        const noteIndex: NoteIndex[] = await indexResponse.json();

        // Load each note file
        const notesPromises = noteIndex.map(async (noteItem) => {
          const fileResponse = await fetch(`/notes/${noteItem.filename}`);
          if (!fileResponse.ok) {
            throw new Error(`Failed to load note ${noteItem.id}`);
          }
          const content = await fileResponse.text();
          return parseNoteFile(content, noteItem.id);
        });

        const loadedNotes = await Promise.all(notesPromises);
        // Sort by ID to ensure correct order
        loadedNotes.sort((a, b) => a.id - b.id);
        setLoveNotes(loadedNotes);
      } catch (error) {
        console.error('Error loading notes:', error);
        // Fallback to empty array or show error message
        setLoveNotes([]);
      } finally {
        setIsLoadingNotes(false);
      }
    };

    loadNotes();
  }, []);

  // Load opened notes from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("openedNotes");
    if (saved) {
      try {
        const openedIds = JSON.parse(saved) as number[];
        setOpenedNotes(new Set(openedIds));
      } catch (e) {
        console.error("Error loading opened notes:", e);
      }
    }
  }, []);

  // Save opened notes to localStorage
  const markNoteAsOpened = (noteId: number) => {
    const newOpenedNotes = new Set(openedNotes);
    newOpenedNotes.add(noteId);
    setOpenedNotes(newOpenedNotes);
    localStorage.setItem("openedNotes", JSON.stringify(Array.from(newOpenedNotes)));
  };

  const handleOpenNote = (note: LoveNote) => {
    setIsOpening(true);
    setTimeout(() => {
      setSelectedNote(note);
      markNoteAsOpened(note.id);
      setIsOpening(false);
    }, 500);
  };

  const handleCloseNote = () => {
    setIsOpening(true);
    setTimeout(() => {
      setSelectedNote(null);
      setIsOpening(false);
    }, 300);
  };

  const handleAdminLogin = () => {
    if (adminPassword === ADMIN_PASSWORD) {
      setIsAdminAuthenticated(true);
      setAdminError("");
      setAdminPassword("");
    } else {
      setAdminError("סיסמת מנהל שגויה");
      setAdminPassword("");
    }
  };

  const handleResetOpenedNotes = () => {
    setOpenedNotes(new Set());
    localStorage.removeItem("openedNotes");
    setIsAdminDialogOpen(false);
    setIsAdminAuthenticated(false);
    setAdminPassword("");
  };

  const handleCloseAdminDialog = () => {
    setIsAdminDialogOpen(false);
    setIsAdminAuthenticated(false);
    setAdminPassword("");
    setAdminError("");
  };

  // Sanitize filename by removing invalid characters
  const sanitizeFileName = (fileName: string): string => {
    return fileName
      .replace(/[<>:"/\\|?*]/g, '') // Remove invalid file name characters
      .replace(/\s+/g, '_') // Replace spaces with underscores
      .trim();
  };

  // Export notes to files
  const handleExportNotes = async () => {
    try {
      // Check if File System Access API is supported
      if ('showDirectoryPicker' in window) {
        // Modern approach: Use File System Access API
        const directoryHandle = await (window as any).showDirectoryPicker({
          mode: 'readwrite'
        });

        // Create files for each note
        for (const note of loveNotes) {
          const fileName = `${note.id}_${sanitizeFileName(note.title)}.txt`;
          const fileHandle = await directoryHandle.getFileHandle(fileName, { create: true });
          const writable = await fileHandle.createWritable();
          
          // Format the note content
          const content = `ID: ${note.id}\nTitle: ${note.title}\nEmoji: ${note.emoji}\n\nMessage:\n${note.message}`;
          
          await writable.write(content);
          await writable.close();
        }

        if (loveNotes.length > 0) {
          alert(`הייצוא הושלם בהצלחה! ${loveNotes.length} מכתבים נשמרו בתיקייה שנבחרה.`);
        }
      } else {
        // Fallback: Download files individually
        for (const note of loveNotes) {
          const fileName = `${note.id}_${sanitizeFileName(note.title)}.txt`;
          const content = `ID: ${note.id}\nTitle: ${note.title}\nEmoji: ${note.emoji}\n\nMessage:\n${note.message}`;
          
          const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = fileName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          
          // Small delay between downloads to avoid browser blocking
          await new Promise(resolve => setTimeout(resolve, 100));
        }

        if (loveNotes.length > 0) {
          alert(`הייצוא הושלם! ${loveNotes.length} קבצים הורדו. אנא שמרי אותם בתיקייה אחת.`);
        }
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        // User cancelled the directory picker
        return;
      }
      console.error('Error exporting notes:', error);
      alert('אירעה שגיאה בייצוא המכתבים. אנא נסי שוב.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(350,60%,97%)] via-[hsl(345,45%,95%)] to-[hsl(35,60%,95%)] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="inline-flex items-center justify-center mb-4">
            <Heart className="h-12 w-12 text-[hsl(345,75%,70%)] fill-[hsl(345,75%,70%)] animate-float" />
            <Sparkles className="h-8 w-8 text-[hsl(0,70%,75%)] mr-2 animate-float" style={{ animationDelay: '0.5s' }} />
          </div>
          <h1 className="font-handwriting text-5xl md:text-6xl text-[hsl(340,40%,25%)] mb-4">
מזל טוב שחר וברוכה הבאה!
          </h1>
          <p className="font-body text-lg md:text-xl text-[hsl(340,25%,50%)] max-w-2xl mx-auto">
שחר, פתחי כשאת צריכה קצת מילים טובות          </p>
        </div>

        {/* Notes Grid */}
        {isLoadingNotes ? (
          <div className="text-center py-12">
            <p className="font-body text-lg text-[hsl(340,25%,50%)]">טוען מכתבים...</p>
          </div>
        ) : !selectedNote ? (
          <div className="flex flex-wrap justify-center gap-6">
            {loveNotes.map((note, index) => (
              <Card
                key={note.id}
                className="cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl border-2 border-[hsl(345,35%,90%)] bg-white/80 backdrop-blur-sm animate-fade-in-up w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] max-w-sm"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => handleOpenNote(note)}
              >
                <CardHeader className="text-center pb-4 relative">
                  {openedNotes.has(note.id) && (
                    <Badge 
                      variant="secondary" 
                      className="absolute top-2 right-2 bg-[hsl(345,75%,70%)] text-white border-none font-body text-xs"
                    >
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      נפתח
                    </Badge>
                  )}
                  <div className="text-4xl mb-2">{note.emoji}</div>
                  <CardTitle className="font-handwriting text-2xl text-[hsl(340,40%,25%)]">
                    {note.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <Button
                    variant="outline"
                    className="w-full border-[hsl(345,75%,70%)] text-[hsl(345,75%,70%)] hover:bg-[hsl(345,75%,70%)] hover:text-white font-body"
                  >
                    פתחי מכתב
                    <ArrowRight className="mr-2 h-4 w-4 rotate-180" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-start w-full px-4">
            <div className="max-w-2xl w-full">
              <Card className="border-2 border-[hsl(345,35%,90%)] bg-white/90 backdrop-blur-sm shadow-2xl animate-fade-in-up">
              <CardHeader className="text-center pb-6">
                <div className="text-6xl mb-4">{selectedNote.emoji}</div>
                <CardTitle className="font-handwriting text-4xl md:text-5xl text-[hsl(340,40%,25%)] mb-2">
                  {selectedNote.title}
                </CardTitle>
                <CardDescription className="font-body text-base text-[hsl(340,25%,50%)]">
                  תזכורת קטנה בשבילך
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="font-body text-lg md:text-xl leading-relaxed text-[hsl(340,40%,25%)] text-center px-4">
                  {selectedNote.message}
                </p>
                <div className="flex justify-center pt-4">
                  <Button
                    onClick={handleCloseNote}
                    variant="secondary"
                    className="font-body bg-[hsl(345,45%,92%)] hover:bg-[hsl(345,45%,88%)] text-[hsl(340,40%,25%)]"
                  >
                    סגרי מכתב
                  </Button>
                </div>
              </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-12 animate-fade-in-up">
          <p className="font-body text-sm text-[hsl(340,25%,50%)] mb-4">
נעשה באהבה וקצת בקרינג' <Heart className="inline h-4 w-4 text-[hsl(345,75%,70%)] fill-[hsl(345,75%,70%)]" /> ממיתר לשחר
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsAdminDialogOpen(true)}
            className="font-body text-xs text-[hsl(340,25%,50%)] hover:text-[hsl(340,40%,25%)]"
          >
            <Settings className="h-3 w-3 ml-1" />
            מנהל
          </Button>
        </div>

        {/* Admin Dialog */}
        <Dialog open={isAdminDialogOpen} onOpenChange={handleCloseAdminDialog}>
        <DialogContent
          className="w-full max-w-md text-right font-body"
        >
          <DialogHeader           style={{
            direction: 'rtl',
            left: 'auto',
            right: '2rem',
          }}>
            <DialogTitle className="font-handwriting text-2xl text-[hsl(340,40%,25%)] text-right">
              פאנל מנהל
            </DialogTitle>
            <DialogDescription className="font-body text-[hsl(340,25%,50%)] text-right">
              {!isAdminAuthenticated
                ? "הכנס את סיסמת המנהל כדי לגשת לפעולות הניהול"
                : "את מחוברת כמנהלת. תוכלי לאפס את כל המכתבים שנפתחו."}
            </DialogDescription>
          </DialogHeader>

            {!isAdminAuthenticated ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-password" className="font-body text-[hsl(340,40%,25%)]">
                    סיסמת מנהל
                  </Label>
                  <div className="relative">
                    <Input
                      id="admin-password"
                      type={showAdminPassword ? "text" : "password"}
                      value={adminPassword}
                      onChange={(e) => {
                        setAdminPassword(e.target.value);
                        setAdminError("");
                      }}
                      placeholder="הכניסי סיסמת מנהל"
                      className="font-body pl-10 border-[hsl(345,35%,90%)] focus:border-[hsl(345,75%,70%)] focus:ring-[hsl(345,75%,70%)]"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleAdminLogin();
                        }
                      }}
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowAdminPassword(!showAdminPassword)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(340,25%,50%)] hover:text-[hsl(340,40%,25%)] transition-colors"
                    >
                      {showAdminPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {adminError && (
                    <p className="text-sm text-[hsl(0,70%,65%)] font-body animate-fade-in-up">
                      {adminError}
                    </p>
                  )}
                </div>
                <DialogFooter>
                  <Button
                    onClick={handleAdminLogin}
                    className="w-full font-body bg-[hsl(345,75%,70%)] hover:bg-[hsl(345,75%,65%)] text-white"
                    disabled={!adminPassword}
                  >
                    התחברי כמנהלת
                  </Button>
                </DialogFooter>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-[hsl(345,45%,92%)] rounded-lg border border-[hsl(345,35%,90%)]">
                  <p className="font-body text-sm text-[hsl(340,40%,25%)] mb-2">
                    מספר מכתבים שנפתחו: {openedNotes.size} מתוך {loveNotes.length}
                  </p>
                </div>
                <DialogFooter className="flex-col gap-2">
                  <Button
                    onClick={handleExportNotes}
                    className="w-full font-body bg-[hsl(345,75%,70%)] hover:bg-[hsl(345,75%,65%)] text-white"
                  >
                    <Download className="h-4 w-4 ml-2" />
                    ייצא את כל המכתבים לתיקייה
                  </Button>
                  <Button
                    onClick={handleResetOpenedNotes}
                    variant="destructive"
                    className="w-full font-body"
                  >
                    <RotateCcw className="h-4 w-4 ml-2" />
                    אפסי את כל המכתבים שנפתחו
                  </Button>
                  <Button
                    onClick={handleCloseAdminDialog}
                    variant="outline"
                    className="w-full font-body"
                  >
                    סגרי
                  </Button>
                </DialogFooter>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Index;


