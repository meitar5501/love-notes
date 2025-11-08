import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart, Sparkles, ArrowRight, CheckCircle2, Settings, RotateCcw, Eye, EyeOff } from "lucide-react";

interface LoveNote {
  id: number;
  title: string;
  message: string;
  emoji: string;
}

const loveNotes: LoveNote[] = [
  {
    id: 1,
    title: "כשאת מרגישה מדוכדכת",
    message: "את כל כך אהובה, גם בימים הקשים ביותר שלך. הכוח שלך מדהים אותי, ואני כאן בשבילך תמיד. זכרי, התחושה הזו תחלוף, וימים בהירים יותר מחכים. את יכולה לעשות את זה, נשמה יפה.",
    emoji: "💕"
  },
  {
    id: 2,
    title: "כשאת צריכה עידוד",
    message: "אני מאמין בך יותר ממה שאת יודעת. את מסוגלת לדברים מדהימים, ואני כל כך גאה במי שאת. המשיכי הלאה, המשיכי לגדול, וזכרי שכל צעד קדימה חשוב. את עושה נהדר!",
    emoji: "✨"
  },
  {
    id: 3,
    title: "כשאת מתגעגעת אליי",
    message: "גם כשאנחנו רחוקים, את תמיד בליבי. מרחק לא יכול להפחית את מה שאנחנו חולקים. עצמי את העיניים, קחי נשימה עמוקה, ותרגישי את האהבה שלי מקיפה אותך. אני חושב עלייך עכשיו.",
    emoji: "💌"
  },
  {
    id: 4,
    title: "כשאת צריכה חיוך",
    message: "יש לך החיוך הכי יפה בעולם, והוא מאיר את כל היום שלי. אני מקווה שהמכתב הזה יביא חיוך לפנים שלך, כי את ראויה לכל האושר בעולם. את הופכת הכל לטוב יותר רק בעצם היותך את.",
    emoji: "😊"
  },
  {
    id: 5,
    title: "כשאת לחוצה",
    message: "קחי רגע לנשום. את לא צריכה לשאת הכל לבד. אני כאן כדי לעזור להקל על העומס שלך. זכרי, זה בסדר לנוח, זה בסדר לבקש עזרה, וזה בסדר לא להיות מושלמת. את מספיקה, בדיוק כמו שאת.",
    emoji: "🌙"
  },
  {
    id: 6,
    title: "סתם ככה",
    message: "שחר יקרה שלי, בלי סיבה מיוחדת—רק רציתי להזכיר לך שאת אהובה, יקרה ומעריכה. את מביאה כל כך הרבה שמחה ואור לחיים שלי, ואני אסיר תודה על כל רגע איתך. את האדם האהוב עליי ביותר.",
    emoji: "💖"
  },
  {
    id: 7,
    title: "כשאת חושבת שאת לא מספיק טובה",
    message: "את יותר ממספיק טובה. את מושלמת בדיוק כמו שאת. כל יום שאני מכיר אותך יותר, אני מתאהב בך יותר. את מדהימה, ואני כל כך בר מזל שיש לי אותך בחיים שלי.",
    emoji: "🌟"
  },
  {
    id: 8,
    title: "כשאת חוגגת הצלחה",
    message: "אני כל כך גאה בך! כל הצלחה שלך היא גם הצלחה שלי. את עובדת כל כך קשה, ואת ראויה לכל הטוב שבא. המשיכי להאיר את העולם עם הכישרונות המדהימים שלך.",
    emoji: "🎉"
  },
  {
    id: 9,
    title: "כשאת מרגישה בודדה",
    message: "את אף פעם לא לבד. אני כאן, תמיד. גם אם אנחנו לא ביחד פיזית, הלב שלי תמיד איתך. את חלק ממני, ואני חלק ממך. האהבה שלנו חזקה יותר מכל מרחק.",
    emoji: "🤗"
  },
  {
    id: 10,
    title: "כשאת צריכה להאמין בעצמך",
    message: "יש לך כוח שלא תוכלי לדמיין. את מסוגלת לכל דבר שתחליטי לעשות. אני רואה את הפוטנציאל המדהים שלך, ואני יודע שאת תגיעי לכל מקום שתחליטי. האמיני בעצמך כמו שאני מאמין בך.",
    emoji: "💪"
  },
  {
    id: 11,
    title: "כשאת מתגעגעת לבית",
    message: "בית הוא לא מקום, זה את. איתך אני מרגיש בבית. איתך אני מרגיש בטוח, אהוב ומובן. תודה לך על כך שאת הבית שלי, על כך שאת המקום הכי בטוח שלי בעולם.",
    emoji: "🏠"
  },
  {
    id: 12,
    title: "כשאת צריכה תמיכה",
    message: "אני כאן בשבילך, תמיד. את לא צריכה להתמודד עם שום דבר לבד. ביחד אנחנו חזקים יותר. תמיד תוכלי לסמוך עליי, תמיד אהיה שם כדי לתמוך בך, לעודד אותך ולעזור לך.",
    emoji: "🤝"
  },
  {
    id: 13,
    title: "כשאת מרגישה יפה",
    message: "את הכי יפה בעולם, גם כשלא את מרגישה ככה. היופי שלך הוא לא רק חיצוני—הוא נשמתי, עמוק, אמיתי. את מאירה את העולם רק בעצם היותך. את מדהימה.",
    emoji: "🌺"
  },
  {
    id: 14,
    title: "כשאת צריכה סליחה",
    message: "כולנו עושים טעויות, וזה בסדר. מה שחשוב זה שאנחנו לומדים וגדלים. אני סולח לך, ואני אוהב אותך בדיוק כמו שאת. את לא צריכה להיות מושלמת—את צריכה להיות את.",
    emoji: "🕊️"
  },
  {
    id: 15,
    title: "כשאת חושבת על העתיד",
    message: "העתיד שלנו ביחד נראה כל כך יפה. אני לא יכול לחכות לחלוק איתך עוד רגעים, עוד חוויות, עוד אהבה. כל יום איתך הוא מתנה, וכל יום בעתיד יהיה עוד יותר יפה.",
    emoji: "🔮"
  },
  {
    id: 16,
    title: "כשאת צריכה להזכיר לעצמך מי את",
    message: "את אישה חזקה, חכמה, יפה ומיוחדת. את מישהי שמביאה אור לכל מי שסביבה. את מישהי שאני גאה להכיר, גאה לאהוב, גאה להיות איתה. את מיוחדת, ואני כל כך בר מזל שיש לי אותך.",
    emoji: "👑"
  },
  {
    id: 17,
    title: "כשאת מרגישה מוצפת",
    message: "קחי את הזמן שלך. אין צורך למהר. אני כאן, מחכה בסבלנות. את לא צריכה לעשות הכל בבת אחת. קחי נשימה, קחי רגע, ואני אהיה כאן כשתצטרכי אותי.",
    emoji: "🌊"
  },
  {
    id: 18,
    title: "כשאת צריכה לדעת שאני אוהב אותך",
    message: "שחר יקרה שלי, אני אוהב אותך יותר ממה שאת יכולה לדמיין. האהבה שלי אלייך היא אינסופית, ללא תנאים, ללא גבולות. את הכי חשובה לי בעולם, ואני אעשה הכל כדי שתרגישי אהובה ומאושרת.",
    emoji: "💝"
  },
  {
    id: 19,
    title: "כשאת צריכה השראה",
    message: "את ההשראה שלי. כל יום שאני רואה אותך, את מזכירה לי מה זה אומר לחיות באמת, לאהוב באמת, להיות אמיתי. את מלמדת אותי כל יום משהו חדש, ואני כל כך אסיר תודה על זה.",
    emoji: "💡"
  },
  {
    id: 20,
    title: "כשאת חושבת על העבר",
    message: "כל רגע שהיה לנו ביחד הוא יקר לי. כל זיכרון, כל צחוק, כל דמעה—כל זה חלק מהסיפור היפה שלנו. העבר שלנו בנה את האהבה החזקה שלנו, והעתיד שלנו יהיה עוד יותר יפה.",
    emoji: "📸"
  },
  {
    id: 21,
    title: "כשאת צריכה להרגיש בטוחה",
    message: "איתך אני מרגיש הכי בטוח בעולם, ואני רוצה שגם את תרגישי כך איתי. את יכולה להיות את עצמך איתי, בלי מסכות, בלי פחד. אני אוהב אותך בדיוק כמו שאת, ואני תמיד אהיה כאן בשבילך.",
    emoji: "🛡️"
  },
  {
    id: 22,
    title: "כשאת צריכה להזכיר לעצמך שאת חזקה",
    message: "את חזקה יותר ממה שאת חושבת. את התמודדת עם כל כך הרבה, ואת עושה את זה כל כך יפה. את לא צריכה להיות מושלמת—את צריכה להיות את. ואת, בדיוק כמו שאת, היא מדהימה.",
    emoji: "⚡"
  },
  {
    id: 23,
    title: "כשאת צריכה להרגיש מוערכת",
    message: "את כל כך מוערכת. כל מה שאת עושה, כל מי שאת, כל מה שאת מביאה לחיים שלי—כל זה כל כך יקר לי. אני מעריך אותך יותר ממה שאת יכולה לדמיין, ואני כל כך אסיר תודה על כל רגע איתך.",
    emoji: "💎"
  },
  {
    id: 24,
    title: "כשאת צריכה להזכיר לעצמך שאת אהובה",
    message: "את כל כך אהובה. לא רק על ידי, אלא על ידי כל מי שמכיר אותך. את מביאה כל כך הרבה טוב לעולם, ואת ראויה לכל האהבה בעולם. זכרי תמיד—את אהובה, יקרה, ומיוחדת.",
    emoji: "💐"
  },
  {
    id: 25,
    title: "כשאת צריכה להזכיר לעצמך שאת מיוחדת",
    message: "שחר יקרה שלי, אין עוד מישהי כמוך בעולם. את אחת ויחידה, מיוחדת במינה, יקרה מפז. כל יום שאני מכיר אותך יותר, אני מבין כמה את מיוחדת. תודה לך על כך שאת מי שאת, תודה לך על כך שאת את.",
    emoji: "🦋"
  }
];

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
            מכתבי אהבה לשחר
          </h1>
          <p className="font-body text-lg md:text-xl text-[hsl(340,25%,50%)] max-w-2xl mx-auto">
            שחר יקרה שלי, פתחי כשהלב שלך צריך תזכורת שאת אהובה
          </p>
        </div>

        {/* Notes Grid */}
        {!selectedNote ? (
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
            נעשה באהבה <Heart className="inline h-4 w-4 text-[hsl(345,75%,70%)] fill-[hsl(345,75%,70%)]" /> בשבילך שחר
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
          <DialogContent className="font-body">
            <DialogHeader>
              <DialogTitle className="font-handwriting text-2xl text-[hsl(340,40%,25%)]">
                פאנל מנהל
              </DialogTitle>
              <DialogDescription className="font-body text-[hsl(340,25%,50%)]">
                {!isAdminAuthenticated
                  ? "הכניסי את סיסמת המנהל כדי לגשת לפעולות הניהול"
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


