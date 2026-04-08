Set WshShell = CreateObject("WScript.Shell")

' Get the true directory of this VBScript even if run from a shortcut
fsoPath = CreateObject("Scripting.FileSystemObject").GetParentFolderName(WScript.ScriptFullName)
WshShell.CurrentDirectory = fsoPath

' Run the batch script completely hidden (0) so no CMD windows pop up
WshShell.Run chr(34) & fsoPath & "\run_dev.bat" & Chr(34), 0

Set WshShell = Nothing
