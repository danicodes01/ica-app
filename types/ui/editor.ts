// types/ui/editor

export type SupportedLanguage = 'typescript' | 'javascript' | 'python' | 'java' | 'csharp' | 'php';

export interface CodeEditorProps {
  initialCode?: string;
  defaultLanguage?: SupportedLanguage;
  defaultValue?: string;
  value?: string;
  height?: string;
  readOnly?: boolean;
  onCodeSubmit?: (code: string) => Promise<void>;
  onLanguageChange?: (language: SupportedLanguage) => void;
}