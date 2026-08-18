/* Ban dich tieng Anh cua cac tinh huong / English translations of the cases.
   Khoa la id cua tinh huong trong scenarios.js. Thu tu meta va lines phai khop tuyet doi.
   Keys match the scenario ids in scenarios.js. The order of meta and lines must match exactly.
   Neu mot tinh huong chua co ban dich, giao dien tu dong hien ban tieng Viet.
   If a case has no translation yet, the interface falls back to Vietnamese. */

export const EN = {
  p1: {
    meta: [
      { v: "Education Support Fund <support@hocbong-2026.xyz>", why: "The domain hocbong-2026.xyz belongs to no school, no education department and no real fund. The .xyz ending is popular for domains registered in minutes." },
      { v: "NOTICE: You are on the list for a 15,000,000 VND scholarship" },
      { v: "2:14 AM, Sunday" },
    ],
    lines: [
      { t: "Dear student," },
      { t: "Your file has been automatically selected by the review board for a scholarship worth 15,000,000 VND.", why: "You never submitted a file, so nothing could have been reviewed. A real scholarship starts with an application you sent yourself." },
      { t: "Please confirm within 24 hours or the award will be passed to another candidate.", why: "Time pressure is the most basic scam technique: if you hurry, you do not check." },
      { t: "Processing fee: 150,000 VND, transfer to account 0912xxxxxx - NGUYEN VAN T.", why: "A real scholarship never asks you to pay first, and certainly not into a personal account." },
      { t: "Click here to claim: http://hocbong-2026.xyz/nhan-thuong", why: "The link points to no official site at all, and it uses http rather than https." },
      { t: "Regards, Fund Management Board" },
    ],
    why: "A textbook scholarship scam: you are selected without applying, there is a tight deadline, and a small fee has to be transferred in advance to a personal account.",
    tip: "No scholarship comes looking for you with a fee attached.",
  },
  p2: {
    meta: [{ v: "NGUYEN TRAI HIGH SCHOOL" }, { v: "4:05 PM, Friday" }],
    lines: [
      { t: "School notice: no classes on Monday 2 September for National Day. Normal timetable resumes Tuesday 3 September." },
      { t: "Parents are asked to remind their children." },
    ],
    why: "The message only conveys information. There is no link, nothing is requested from you, nothing is rushed and nothing is promised. This is an ordinary branded notification from the school.",
    tip: "A message that only informs, and asks nothing of you, is usually safe.",
  },
  p3: {
    meta: [{ v: "Online Recruitment 24h", why: "A newly created account with a generic name, not a company you can look up anywhere." }],
    lines: [
      { t: "Hi, we are hiring work-from-home data entry assistants, 250,000 to 400,000 VND per day.", why: "Pay far above market for work needing no skills. This is the bait." },
      { t: "The work is very light, no experience needed, anyone can do it.", why: "Easy work, high pay is the standard formula of gig-work scams." },
      { t: "Add me on Zalo at 09xx and I will walk you through it.", why: "Pulling you off a public platform into a private channel, where nobody can see and no record survives." },
      { t: "For the first order you deposit 300,000 VND, and once it is completed I refund the deposit plus your commission.", why: "The deposit is the decisive sign. Your money goes first, the work never arrives." },
    ],
    why: "The whole model is a task scam: the first few small refunds build trust, then the operator disappears once you commit a large amount.",
    tip: "Real work pays you. You never pay to be allowed to work.",
  },
  p4: {
    meta: [
      { v: "Google <no-reply@accounts.google.com>" },
      { v: "Security alert: new sign-in on a Windows device" },
    ],
    lines: [
      { t: "Your Google account was just signed in on a new Windows device." },
      { t: "Device: Windows. Time: 8:41 PM, 12 March. Approximate location: Hanoi, Vietnam." },
      { t: "If this was you, no further action is needed." },
      { t: "If it was not you, review your account activity at https://myaccount.google.com/notifications" },
    ],
    why: "The mail comes from the official accounts.google.com domain, asks for no password, applies no pressure, and links back to myaccount.google.com. Real security alerts usually tell you that no action is needed if it was you.",
    tip: "Real alerts give you time. Fake ones demand action now.",
  },
  p5: {
    meta: [{ v: "http://faceb00k-security-check.top/login", why: "The domain uses zeros instead of the letter o and adds a .top ending. Real Facebook logins only happen on facebook.com." }],
    lines: [
      { t: "Your account has been reported for violating community standards.", why: "A threat of losing the account, so you panic and log in immediately." },
      { t: "Sign in again within 12 hours to verify, or the account will be permanently disabled.", why: "A tight deadline with a heavy consequence. Facebook does not handle appeals through pressure mail like this." },
      { t: "[ email or phone field ]  [ password field ]", why: "An unfamiliar page asking for another service's password is the definition of phishing." },
    ],
    why: "This is a fake login page. The first thing to read is always the address bar, never the design, because a design is trivially copied.",
    tip: "Before you type a password, read the domain carefully from right to left.",
  },
  p6: {
    meta: [{ v: "Ms Hang, form teacher (new number)", why: "A new number with a profile photo lifted from the teacher's Facebook. Switching numbers and immediately raising money is the classic impersonation pattern." }],
    lines: [
      { t: "This is Ms Hang, I have changed to a new number." },
      { t: "Our class needs to pay 500,000 VND for tomorrow's activity urgently. Send it for me now and I will collect from everyone tomorrow.", why: "An urgent money request wrapped in a plausible reason and a deadline." },
      { t: "Transfer to account 19xxxxxx, account holder LE THI M. My own account is having problems.", why: "The account holder's name does not match the sender. The broken-account excuse exists to explain that mismatch away." },
      { t: "Do not mention it to the others in class, I will announce it later.", why: "A secrecy request so you cannot cross-check with classmates or parents." },
    ],
    why: "The scammer impersonates someone you know, uses a new number, invents urgency and asks you to keep quiet. One call to the teacher's old number exposes it instantly.",
    tip: "Someone you know asking for money from an unknown number: call the old number first.",
  },

  q1: {
    meta: [
      { v: "IT Support <it-support@office365-verify.icu>", why: "Your school's IT team writes from the school's own domain, not from office365-verify.icu." },
      { v: "Your Office 365 account is about to be deleted" },
    ],
    lines: [
      { t: "Our system has detected that your account has not been re-verified under the new policy.", why: "A vague technical reason that sounds official but cannot be checked anywhere." },
      { t: "Verify before 5 PM today, after which all mail and data will be deleted.", why: "A threat of data loss so you act before you think." },
      { t: "Verify at: https://office365-verify.icu/school/login", why: "The link leads to an unfamiliar domain, not to your school or to Microsoft." },
      { t: "Enter your school email and current password to complete the process.", why: "It asks for your password. No real system makes you submit a password through a page linked in an email." },
    ],
    why: "Phishing aimed at school accounts. The target is not your money but your account, which is then used to scam your classmates and teachers.",
    tip: "Never log in through a link in a message. Open the official site yourself and log in there.",
  },
  q2: {
    meta: [
      { v: "School library <thuvien@thptnguyentrai.edu.vn>" },
      { v: "Overdue book reminder, 3 days late" },
    ],
    lines: [
      { t: "Hi Minh," },
      { t: "The copy of Advanced Calculus 12 you borrowed on 5 March is now 3 days overdue." },
      { t: "Please bring it back to the library during office hours, or speak to Ms Lan at the desk if there is a problem." },
      { t: "The library is open 7:30 AM to 4:30 PM on weekdays." },
    ],
    why: "The domain is the school's own, the message refers to something specific you actually did, there is no link, no request for information and no money involved. The resolution is to go and talk to a real person.",
    tip: "Real mail tends to send you to a real person; fake mail always pushes you into a link.",
  },
  q3: {
    meta: [{ v: "+84 39xx xxx xxx", why: "A carrier loyalty programme sends branded messages, not messages from a personal mobile number." }],
    lines: [
      { t: "CONGRATULATIONS! Your number has WON an iPhone 16 Pro in our customer appreciation draw.", why: "You won something you never entered. The capitals are there to create excitement." },
      { t: "Tap the link to claim: http://tri-an-viettel.click/qua", why: "The domain borrows the brand name but ends in .click and is not the carrier's real site." },
      { t: "You only need to pay a 99,000 VND shipping fee to receive the device.", why: "A small fee for a large prize. This is how they take your money and your card details." },
      { t: "The claim code expires in 6 hours.", why: "A tight deadline, once again." },
    ],
    why: "No real prize requires you to pay first. The 99,000 VND is simply a pretext to capture your card details.",
    tip: "Real prizes charge nothing. Anyone charging you to receive a gift is running a trap.",
  },
  q4: {
    meta: [
      { v: "A QR sticker pasted over the informatics contest poster in the school lobby", why: "A sticker over the original code is a common trick. The paper edge is a different shade and sits crooked against the poster design." },
      { v: "Address after scanning: http://dangky-cuocthi.top/sso", why: "Not a school domain, served over http, and ending in .top." },
    ],
    lines: [
      { t: "Sign in with your school account to register for the contest", why: "A contest does not need your school account password to record your name." },
      { t: "[ username field ]  [ password field ]  [ Sign in ]", why: "Another credential harvesting form." },
    ],
    why: "A QR code is just a link your eyes cannot read before you scan it. Always read the address that appears, and be wary of codes pasted over other codes.",
    tip: "After scanning, pause and read the address before you open it.",
  },
  q5: {
    meta: [
      { v: "Informatics Olympiad organisers <bto@olp.edu.vn>" },
      { v: "Team registration confirmed, team code NT-042" },
    ],
    lines: [
      { t: "Hello," },
      { t: "We confirm the registration of team NT-042 with 3 members, submitted by Mr Hung on 10 March." },
      { t: "The schedule and rules are published on the official contest site, which you can open yourself." },
      { t: "If any member details are wrong, reply to this email before 20 March." },
    ],
    why: "The mail matches something you genuinely did, carries a specific team code and the name of the supervising teacher, and asks for no password, no money and no haste.",
    tip: "Real mail usually references a detail only you and the sender could know.",
  },
  q6: {
    meta: [{ v: "Telegram group: High-income TikTok tasks", why: "A closed Telegram group with no legal entity behind it and nowhere to complain when the money is gone." }],
    lines: [
      { t: "Today's task: like 20 videos, capital returned plus 15% commission within 10 minutes.", why: "High, instant returns do not exist in real work." },
      { t: "For your first task, top up 300,000 VND into the platform wallet to activate it.", why: "You have to pay first. This is the line you never cross." },
      { t: "Screenshots of other members who withdrew 8 million VND earlier today.", why: "Fabricated social proof. A screenshot takes minutes to edit." },
      { t: "To withdraw you must complete 3 tasks in a row; stopping midway forfeits your entire balance.", why: "The withdrawal rules exist to keep you topping up. The balance on screen is only a number they control." },
    ],
    why: "This is a top-up task scam. The first withdrawals really do work, so you trust it, and then the system invents a reason for a large deposit that never comes back.",
    tip: "If you have to pay to start working, it is not work.",
  },

  r1: {
    meta: [
      { v: "Vietcombank <support@vietcombank-verify.click>", why: "The real bank uses vietcombank.com.vn. Anything bolted on after a hyphen is a forgery." },
      { v: "Your account has been temporarily locked" },
    ],
    lines: [
      { t: "Dear Valued Customer,", why: "Your bank knows your name. A generic greeting means this went out in bulk." },
      { t: "Our system recorded unusual transactions and your account has been temporarily locked.", why: "A lock threat designed to cause panic." },
      { t: "Please verify within 12 hours to restore access.", why: "A short deadline." },
      { t: "Verify at: https://vietcombank-verify.click/otp", why: "A forged domain, and the page behind it will ask for your OTP." },
      { t: "Have your card number, expiry date and the OTP sent to your phone ready.", why: "No bank asks for a full card number or an OTP. The OTP is the last key to your account." },
    ],
    why: "The entire mail aims at one thing: your OTP. The moment you read it out, the money leaves.",
    tip: "An OTP is your own single-use password. Never read it to anyone, including someone claiming to be from the bank.",
  },
  r2: {
    meta: [
      { v: "Academic Office <phongdaotao.thongbao@gmail.com>", why: "A school's academic office does not send official notices from Gmail." },
      { v: "Student portal update" },
    ],
    lines: [
      { t: "The school has upgraded the student information portal." },
      { t: "Sign in again at portal.thptnguyentrai.edu.vn (the actual link goes to http://portal-nguyentrai.top/login)", why: "The visible text and the real destination differ. This is the single clearest sign of phishing." },
      { t: "If you do not sign in again before 10 PM, your term grades will not be displayed.", why: "An invented consequence paired with a deadline." },
      { t: "Regards." },
    ],
    why: "The visible text of a link is not its address. On a computer, hover over the link and read the address at the bottom of the screen; on a phone, press and hold to preview it.",
    tip: "Always check a link's real address, not the words shown to you.",
  },
  r3: {
    meta: [{ v: "VIETCOMBANK" }],
    lines: [
      { t: "Your OTP is 482913, valid for 3 minutes." },
      { t: "Vietcombank will never ask you for your OTP. Do not share this code with anyone." },
    ],
    why: "This is a genuine OTP that you triggered yourself, and it reminds you not to share the code. If an OTP arrives when you did nothing, someone is trying to get into your account.",
    tip: "An OTP you did not request means change your password now, and read the code to nobody.",
  },
  r4: {
    meta: [{ v: "Police officer Nguyen Van H. (Zalo)", why: "Police forces work through written summons at a station, not over Zalo or a video call." }],
    lines: [
      { t: "Your national ID number is linked to a money laundering ring currently under investigation.", why: "An accusation designed to frighten. Fear is what stops people from verifying." },
      { t: "This case is confidential; you may not tell your family or friends.", why: "The secrecy demand cuts you off from anyone who might talk you out of it." },
      { t: "You must provide your bank account and transfer the full balance to a holding account to prove your innocence.", why: "There is no such thing as a holding account you transfer your own money into." },
      { t: "Install the security app at this link to cooperate with the investigation.", why: "Apps from outside the official stores are usually malware that takes over the phone." },
    ],
    why: "Impersonation of law enforcement. Three signs always travel together: an accusation, a demand for secrecy, and a request to transfer money or install an app.",
    tip: "Anyone telling you to keep it secret from your family is scamming you.",
  },
  r5: {
    meta: [{ v: "Trang (classmate)", why: "It really is your friend's account, but accounts get taken over. Knowing the person is not the same as the message being safe." }],
    lines: [
      { t: "Hey, do you have any money? Can you lend me 2 million, something urgent came up.", why: "An urgent loan request by message is the first script run from a hijacked account." },
      { t: "Send it to this number for me, my own account is broken: 0982xxxxxx, holder PHAM VAN K.", why: "The account holder is not your friend's name. That is the clearest tell." },
      { t: "I am busy and cannot take calls right now, just send it.", why: "Refusing a phone call. Whoever took the account cannot fake your friend's voice." },
    ],
    why: "A hijacked account. The account really is your friend's; the person typing is not.",
    tip: "Before sending money to a friend who messaged you, call them on the phone.",
  },
  r6: {
    meta: [
      { v: "Hanoi University of Science and Technology <tuyensinh@hust.edu.vn>" },
      { v: "Invitation: Admissions Open Day 2026" },
    ],
    lines: [
      { t: "The university invites grade 12 students to attend our admissions open day." },
      { t: "Time: 8:00 AM, 15 April. Venue: university stadium, 1 Dai Co Viet, Hanoi." },
      { t: "The event is free, no registration is required, students may simply attend." },
      { t: "Full details are published on the university's official admissions page." },
    ],
    why: "The address matches the university domain, the event has a specific time and place you can verify, nothing is charged, no personal data is requested and no deadline is imposed.",
    tip: "Real information can always be confirmed at a second source you find yourself.",
  },
  r7: {
    meta: [{ v: "+84 78xx xxx xxx", why: "Government bodies do not send notices from personal mobile numbers." }],
    lines: [
      { t: "The Ministry of Education has launched the official exam results lookup app.", why: "Borrowing the authority of a government body to manufacture trust." },
      { t: "Download at: http://tracuu-diemthi.top/diem-thi.apk", why: "An .apk installed outside the official store. This is the most common route to taking over an Android phone." },
      { t: "The app needs SMS read permission to fill in your lookup code automatically.", why: "SMS read permission lets the app harvest your OTPs without you ever seeing them." },
    ],
    why: "This is malware distribution. Once an app can read your messages, the attacker can capture OTPs and empty your bank account.\n\nOnly install apps from the App Store or Google Play.",
    tip: "Never install an .apk sent to you in a message.",
  },
  r8: {
    meta: [
      { v: "https://veconcert-giare2026.shop/dat-ve", why: "A freshly registered domain ending in .shop, belonging to no known ticket seller." },
      { v: "Advertised by a newly created fan page with no older posts" },
    ],
    lines: [
      { t: "Concert tickets at just 40% of face value, limited quantity.", why: "The unusually low price is the main bait." },
      { t: "Bank transfer to a personal account only, no payment gateway available.", why: "They avoid gateways because gateways can reverse payments and be traced. Personal transfers cannot." },
      { t: "No company details, tax code or contact address anywhere in the footer.", why: "A lawful sales page is required to publish its legal identity." },
      { t: "Pay a 50% deposit now to hold your ticket, the rest on delivery.", why: "A deposit for goods that do not exist." },
    ],
    why: "A fake ticket shop. The decisive combination is a price that is too low plus personal bank transfers only.",
    tip: "Personal transfers only and no company details: stop there.",
  },
  r9: {
    meta: [
      { v: "Vu A Dinh Education Fund <lienhe@quyvuadinh.org>" },
      { v: "Round 1 scholarship results, 2026" },
    ],
    lines: [
      { t: "Hello Hoa," },
      { t: "We are writing to confirm that the application you submitted on 12 January has passed round 1." },
      { t: "Interviews take place at the fund's office; please bring your original school record for verification." },
      { t: "The fund does not charge any fee at any stage of the selection process." },
      { t: "If you need help, contact Ms Mai on the office number published on the fund's website." },
    ],
    why: "It refers to an application you really submitted, the process happens in person, it states plainly that no fees are charged, and it directs you to look up the contact number yourself rather than handing you an unknown one.",
    tip: "A real scholarship starts with a file you sent, not with a surprise announcement.",
  },
  r10: {
    meta: [{ v: "EduSmart English Centre", why: "An account messaging students directly, bypassing the school entirely." }],
    lines: [
      { t: "Congratulations, you have been selected for a free English course worth 12 million VND.", why: "Selected without applying. The large figure is quoted so that walking away feels like a loss." },
      { t: "Send us your full name, school, class and your parents' phone number so we can activate your place.", why: "Harvesting family contact details. Your parents' number is the next step of the scam." },
      { t: "The centre will send a verification code to your phone; please read that code back to me.", why: "This is the OTP capture step. A code sent to your phone is never read out to anyone." },
      { t: "The place is only held until the end of today.", why: "A same-day deadline so you cannot ask your parents first." },
    ],
    why: "The free gift is only packaging. What they actually want is the verification code and your family's contact details.\n\nA verification code sent to your phone always belongs to you alone.",
    tip: "Never read a verification code to anyone, whatever they promise you.",
  },
};

/* Nhan cua cac dong tieu de / labels used in the meta rows. */
export const META_KEY_EN = {
  "Từ": "From",
  "Chủ đề": "Subject",
  "Thời gian": "Time",
  "Người gửi": "Sender",
  "Địa chỉ": "URL",
  "Bối cảnh": "Context",
  "Địa chỉ sau khi quét": "URL after scanning",
};
