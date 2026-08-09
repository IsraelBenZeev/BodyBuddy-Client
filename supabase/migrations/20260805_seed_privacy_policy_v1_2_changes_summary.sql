UPDATE legal_documents
SET
  changes_summary_he = ARRAY[
    'עדכנו את הגבלת הגיל לשימוש באפליקציה מ-13+ ל-18+ — ראה סעיף 8, פרטיות ילדים',
    'הוספנו פירוט חדש על מיקום ואחסון הנתונים שלך — ראה סעיף 5, מיקום ואחסון הנתונים'
  ],
  changes_summary_en = ARRAY[
    'Updated the minimum age to use the app from 13+ to 18+ — see Section 8, Children''s Privacy',
    'Added new details about where your data is stored — see Section 5, Data Storage Location'
  ]
WHERE document_type = 'privacy_policy' AND version = '1.2';
