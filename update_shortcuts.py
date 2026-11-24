import os
import subprocess

shortcut_dir = r"C:\Users\toanv\OneDrive\Desktop\Shortcut"
game_dir = r"c:\Users\toanv\OneDrive\Desktop\Game 3"
bat_file = os.path.join(shortcut_dir, "start_game.bat")
ico_file = os.path.join(shortcut_dir, "game.ico")

ps_content = """
$ws = New-Object -ComObject WScript.Shell

$s1 = $ws.CreateShortcut('C:\\Users\\toanv\\OneDrive\\Desktop\\Shortcut\\BepHonLoan.lnk')
$s1.TargetPath = 'cmd.exe'
$s1.Arguments = '/c ""C:\\Users\\toanv\\OneDrive\\Desktop\\Shortcut\\start_game.bat""'
$s1.WorkingDirectory = 'c:\\Users\\toanv\\OneDrive\\Desktop\\Game 3'
$s1.IconLocation = 'C:\\Users\\toanv\\OneDrive\\Desktop\\Shortcut\\game.ico,0'
$s1.Save()

$s2 = $ws.CreateShortcut('C:\\Users\\toanv\\OneDrive\\Desktop\\Shortcut\\Play_Overcooked_VN.lnk')
$s2.TargetPath = 'cmd.exe'
$s2.Arguments = '/c ""C:\\Users\\toanv\\OneDrive\\Desktop\\Shortcut\\start_game.bat""'
$s2.WorkingDirectory = 'c:\\Users\\toanv\\OneDrive\\Desktop\\Game 3'
$s2.IconLocation = 'C:\\Users\\toanv\\OneDrive\\Desktop\\Shortcut\\game.ico,0'
$s2.Save()
"""

with open("temp_sc.ps1", "w", encoding="utf-8") as f:
    f.write(ps_content)

subprocess.run(["powershell", "-ExecutionPolicy", "Bypass", "-File", "temp_sc.ps1"], check=True)
if os.path.exists("temp_sc.ps1"):
    os.remove("temp_sc.ps1")

print("Shortcuts successfully updated!")
