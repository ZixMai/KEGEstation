using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace KEGEstation.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class editorfield : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "image_s3_keys",
                table: "kim_tasks",
                newName: "editor_json");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "editor_json",
                table: "kim_tasks",
                newName: "image_s3_keys");
        }
    }
}
