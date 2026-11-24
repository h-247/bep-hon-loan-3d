import os
import subprocess
import shutil

shortcut_dir = r"C:\Users\toanv\OneDrive\Desktop\Shortcut"
game_dir = r"C:\Users\toanv\OneDrive\Desktop\Game 3"
bat_file = os.path.join(game_dir, "Chơi Bếp Hỗn Loạn.bat")
ico_file = os.path.join(game_dir, "game.ico")
ico_dest = os.path.join(shortcut_dir, "game.ico")

# Ensure bat file exists in shortcut dir too
bat_dest = os.path.join(shortcut_dir, "Chơi Bếp Hỗn Loạn.bat")
shutil.copyfile(bat_file, bat_dest)
shutil.copyfile(ico_file, ico_dest)

ps_script = f"""
$ws = New-Object -ComObject WScript.Shell

$s = $ws.CreateShortcut('{shortcut_dir}\\BepHonLoan.lnk')
$s.TargetPath = 'cmd.exe'
$s.Arguments = '/c "{bat_dest}"'
$s.WorkingDirectory = '{game_dir}'
$s.IconLocation = '{ico_dest},0'
$s.Description = 'Chơi Bếp Hỗn Loạn - Trò chơi nấu ăn phối hợp 3D'
$s.Save()

$s2 = $ws.CreateShortcut('{shortcut_dir}\\Bếp Hỗn Loạn.lnk')
$s2.TargetPath = 'cmd.exe'
$s2.Arguments = '/c "{bat_dest}"'
$s2.WorkingDirectory = '{game_dir}'
$s2.IconLocation = '{ico_dest},0'
$s2.Description = 'Chơi Bếp Hỗn Loạn - Trò chơi nấu ăn phối hợp 3D'
$s2.Save()
"""

ps_file = os.path.join(game_dir, "temp_create_shortcut.ps1")
with open(ps_file, "w", encoding="utf-8-sig") as f:
    f.write(ps_script)

subprocess.run(["powershell", "-ExecutionPolicy", "Bypass", "-File", ps_file], check=True)
if os.path.exists(ps_file):
    os.remove(ps_file)

print("✓ Shortcut created successfully in:", shortcut_dir)
