using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace Defi.Direct.Domain.Models
{
    public partial class directContext : DbContext
    {
        public directContext(DbContextOptions<directContext> options) : base(options) { }

        public virtual DbSet<ClientEntityFieldLists> ClientEntityFieldLists { get; set; }
        public virtual DbSet<ClientEntityFields> ClientEntityFields { get; set; }
        public virtual DbSet<ClientEntityFieldValues> ClientEntityFieldValues { get; set; }
        public virtual DbSet<Clients> Clients { get; set; }
        public virtual DbSet<ElementEntityFields> ElementEntityFields { get; set; }
        public virtual DbSet<ElementRolePermissions> ElementRolePermissions { get; set; }
        public virtual DbSet<Elements> Elements { get; set; }
        public virtual DbSet<ElementUserPermissions> ElementUserPermissions { get; set; }
        public virtual DbSet<Entities> Entities { get; set; }
        public virtual DbSet<EntitySnapshots> EntitySnapshots { get; set; }
        public virtual DbSet<FieldListItems> FieldListItems { get; set; }
        public virtual DbSet<FieldLists> FieldLists { get; set; }
        public virtual DbSet<LogEntries> LogEntries { get; set; }
        public virtual DbSet<PasswordConfigurations> PasswordConfigurations { get; set; }
        public virtual DbSet<RolePermissions> RolePermissions { get; set; }
        public virtual DbSet<Roles> Roles { get; set; }
        public virtual DbSet<SchemaVersions> SchemaVersions { get; set; }
        public virtual DbSet<Sites> Sites { get; set; }
        public virtual DbSet<SystemLogs> SystemLogs { get; set; }
        public virtual DbSet<ThemeConfigurations> ThemeConfigurations { get; set; }
        public virtual DbSet<UserClaims> UserClaims { get; set; }
        public virtual DbSet<UserLogins> UserLogins { get; set; }
        public virtual DbSet<UserRoles> UserRoles { get; set; }
        public virtual DbSet<Users> Users { get; set; }
        public virtual DbSet<DataLog> DataLog { get; set; }
        public virtual DbSet<SiteVersions> SiteVersions { get; set; }
		public virtual DbSet<Rules> Rules { get; set; }		
		public virtual DbSet<Apps> Apps { get; set; }

		protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<ClientEntityFieldLists>(entity =>
            {
                entity.HasIndex(e => e.ClientEntityFieldId)
                    .HasDatabaseName("IX_ClientEntityFieldId");

                entity.HasIndex(e => e.FieldListId)
                    .HasDatabaseName("IX_FieldListId");

                entity.Property(e => e.Id).HasDefaultValueSql("(newid())");

                entity.HasOne(d => d.ClientEntityField)
                    .WithMany(p => p.ClientEntityFieldLists)
                    .HasForeignKey(d => d.ClientEntityFieldId)
                    .HasConstraintName("FK_dbo.ClientEntityFieldLists_dbo.ClientEntityFields_ClientEntityFieldId");

                entity.HasOne(d => d.FieldList)
                    .WithMany(p => p.ClientEntityFieldLists)
                    .HasForeignKey(d => d.FieldListId)
                    .HasConstraintName("FK_dbo.ClientEntityFieldLists_dbo.FieldLists_FieldListId");
            });

            modelBuilder.Entity<ClientEntityFields>(entity =>
            {
                entity.Property(e => e.Id).HasDefaultValueSql("(newid())");

                entity.Property(e => e.CreateDate).HasColumnType("datetime");

                entity.Property(e => e.Options).HasMaxLength(4000);

                entity.Property(e => e.UpdateDate).HasColumnType("datetime");

            });

            modelBuilder.Entity<ClientEntityFieldValues>(entity =>
            {
                entity.HasIndex(e => e.ClientEntityFieldId)
                    .HasDatabaseName("IX_ClientEntityFieldId");

                entity.Property(e => e.Id).HasDefaultValueSql("(newid())");

                entity.Property(e => e.CreateDate).HasColumnType("datetime");

                entity.Property(e => e.FieldValue).HasMaxLength(4000);

                entity.Property(e => e.UpdateDate).HasColumnType("datetime");

                entity.HasOne(d => d.ClientEntityField)
                    .WithMany(p => p.ClientEntityFieldValues)
                    .HasForeignKey(d => d.ClientEntityFieldId)
                    .HasConstraintName("FK_dbo.ClientEntityFieldValues_dbo.ClientEntityFields_ClientEntityFieldId");
            });

            modelBuilder.Entity<Clients>(entity =>
            {
                //entity.HasIndex(e => e.DefaultAccountPageId)
                //    .HasName("IX_DefaultAccountPageId");

                //entity.HasIndex(e => e.DefaultEntryPageId)
                //    .HasName("IX_DefaultEntryPageId");

                entity.Property(e => e.Id).HasDefaultValueSql("(newid())");

                entity.Property(e => e.CommonName).HasMaxLength(500);

                entity.Property(e => e.ContactFaxNumber)
                    .HasMaxLength(20)
                    .IsUnicode(false);

                entity.Property(e => e.ContactPhoneNumber)
                    .HasMaxLength(20)
                    .IsUnicode(false);

                entity.Property(e => e.CreateDate).HasColumnType("datetime");

                entity.Property(e => e.HostName).HasMaxLength(500);

                entity.Property(e => e.LegalName).HasMaxLength(500);

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(500);

                entity.Property(e => e.UpdateDate).HasColumnType("datetime");

                /*entity.HasOne(d => d.DefaultAccountPage)
                    .WithMany(p => p.ClientsDefaultAccountPage)
                    //.HasForeignKey(d => d.DefaultAccountPageId)
                    .HasConstraintName("FK_dbo.Clients_dbo.Elements_DefaultAccountPageId");

                entity.HasOne(d => d.DefaultEntryPage)
                    .WithMany(p => p.ClientsDefaultEntryPage)
                    //.HasForeignKey(d => d.DefaultEntryPageId)
                    .HasConstraintName("FK_dbo.Clients_dbo.Elements_DefaultEntryPageId");*/
            });

            modelBuilder.Entity<ElementEntityFields>(entity =>
            {
                entity.HasIndex(e => e.ClientEntityFieldId)
                    .HasDatabaseName("IX_ClientEntityFieldId");

                entity.HasIndex(e => e.ElementId)
                    .HasDatabaseName("IX_ElementId");

                entity.Property(e => e.Id).HasDefaultValueSql("(newid())");

                entity.Property(e => e.CreateDate).HasColumnType("datetime");

                entity.Property(e => e.Options).HasMaxLength(4000);

                entity.Property(e => e.UpdateDate).HasColumnType("datetime");

                entity.HasOne(d => d.ClientEntityField)
                    .WithMany(p => p.ElementEntityFields)
                    .HasForeignKey(d => d.ClientEntityFieldId)
                    .HasConstraintName("FK_dbo.ElementEntityFields_dbo.ClientEntityFields_ClientEntityFieldId");

                entity.HasOne(d => d.Element)
                    .WithMany(p => p.ElementEntityFields)
                    .HasForeignKey(d => d.ElementId)
                    .HasConstraintName("FK_dbo.ElementEntityFields_dbo.Elements_ElementId");
            });

            modelBuilder.Entity<ElementRolePermissions>(entity =>
            {
                entity.HasIndex(e => e.ElementId)
                    .HasDatabaseName("IX_ElementId");

                entity.HasIndex(e => e.RoleId)
                    .HasDatabaseName("IX_RoleId");

                entity.Property(e => e.Id).HasDefaultValueSql("(newid())");

                entity.HasOne(d => d.Element)
                    .WithMany(p => p.ElementRolePermissions)
                    .HasForeignKey(d => d.ElementId)
                    .HasConstraintName("FK_dbo.ElementRolePermissions_dbo.Elements_ElementId");

                entity.HasOne(d => d.Role)
                    .WithMany(p => p.ElementRolePermissions)
                    .HasForeignKey(d => d.RoleId)
                    .HasConstraintName("FK_dbo.ElementRolePermissions_dbo.Roles_RoleId");
            });

            modelBuilder.Entity<Elements>(entity =>
            {
                entity.HasIndex(e => e.ClientId)
                    .HasDatabaseName("IX_ClientId");

                entity.Property(e => e.Id).HasDefaultValueSql("(newid())");

                entity.Property(e => e.CreateDate).HasColumnType("datetime");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(255);

                entity.Property(e => e.Options).HasMaxLength(4000);

                entity.Property(e => e.Tag)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(e => e.UpdateDate).HasColumnType("datetime");

                entity.HasOne(d => d.Client)
                    .WithMany(p => p.Elements)
                    .HasForeignKey(d => d.ClientId)
                    .HasConstraintName("FK_dbo.Elements_dbo.Clients_ClientId");
            });

            modelBuilder.Entity<ElementUserPermissions>(entity =>
            {
                entity.HasIndex(e => e.ElementId)
                    .HasDatabaseName("IX_ElementId");

                entity.HasIndex(e => e.UserId)
                    .HasDatabaseName("IX_UserId");

                entity.Property(e => e.Id).HasDefaultValueSql("(newid())");

                entity.HasOne(d => d.Element)
                    .WithMany(p => p.ElementUserPermissions)
                    .HasForeignKey(d => d.ElementId)
                    .HasConstraintName("FK_dbo.ElementUserPermissions_dbo.Elements_ElementId");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.ElementUserPermissions)
                    .HasForeignKey(d => d.UserId)
                    .HasConstraintName("FK_dbo.ElementUserPermissions_dbo.Users_UserId");
            });

            modelBuilder.Entity<Entities>(entity =>
            {
                entity.Property(e => e.Id).HasDefaultValueSql("(newid())");

                entity.Property(e => e.CreateDate).HasColumnType("datetime");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(e => e.Options).HasMaxLength(4000);

                entity.Property(e => e.TypeName).HasMaxLength(400);

                entity.Property(e => e.UpdateDate).HasColumnType("datetime");
            });

            modelBuilder.Entity<EntitySnapshots>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.CreateDate).HasColumnType("datetime");
            });

            modelBuilder.Entity<FieldListItems>(entity =>
            {
                entity.HasIndex(e => e.FieldListId)
                    .HasDatabaseName("IX_FieldListId");

                entity.Property(e => e.Id).HasDefaultValueSql("(newid())");

                entity.Property(e => e.CreateDate).HasColumnType("datetime");

                entity.Property(e => e.Display)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(e => e.UpdateDate).HasColumnType("datetime");

                entity.HasOne(d => d.FieldList)
                    .WithMany(p => p.FieldListItems)
                    .HasForeignKey(d => d.FieldListId)
                    .HasConstraintName("FK_dbo.FieldListItems_dbo.FieldLists_FieldListId");
            });

            modelBuilder.Entity<FieldLists>(entity =>
            {
                entity.HasIndex(e => e.ClientId)
                    .HasDatabaseName("IX_ClientId");

                entity.Property(e => e.Id).HasDefaultValueSql("(newid())");

                entity.Property(e => e.CreateDate).HasColumnType("datetime");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(500);

                entity.Property(e => e.UpdateDate).HasColumnType("datetime");

                entity.HasOne(d => d.Client)
                    .WithMany(p => p.FieldLists)
                    .HasForeignKey(d => d.ClientId)
                    .HasConstraintName("FK_dbo.FieldLists_dbo.Clients_ClientId");
            });

            modelBuilder.Entity<LogEntries>(entity =>
            {
                entity.Property(e => e.Id).HasDefaultValueSql("(newsequentialid())");

                entity.Property(e => e.CreateDate)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("(getdate())");

                entity.Property(e => e.IpAddress).HasMaxLength(4000);

                entity.Property(e => e.Route).HasMaxLength(4000);
            });

            modelBuilder.Entity<PasswordConfigurations>(entity =>
            {
                entity.HasIndex(e => e.ClientId)
                    .HasDatabaseName("IX_ClientId");

                entity.Property(e => e.Id).HasDefaultValueSql("(newid())");

                entity.Property(e => e.CreateDate).HasColumnType("datetime");

                entity.Property(e => e.UpdateDate).HasColumnType("datetime");

                entity.HasOne(d => d.Client)
                    .WithMany(p => p.PasswordConfigurations)
                    .HasForeignKey(d => d.ClientId)
                    .HasConstraintName("FK_dbo.PasswordConfigurations_dbo.Clients_ClientId");
            });

            modelBuilder.Entity<RolePermissions>(entity =>
            {
                entity.HasIndex(e => e.RoleId)
                    .HasDatabaseName("IX_RoleId");

                entity.Property(e => e.Id).HasDefaultValueSql("(newid())");

                entity.HasOne(d => d.Role)
                    .WithMany(p => p.RolePermissions)
                    .HasForeignKey(d => d.RoleId)
                    .HasConstraintName("FK_dbo.RolePermissions_dbo.Roles_RoleId");
            });

            modelBuilder.Entity<Roles>(entity =>
            {
                entity.Property(e => e.Id).HasDefaultValueSql("(newid())");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(256);
            });

            modelBuilder.Entity<SchemaVersions>(entity =>
            {
                entity.Property(e => e.Applied).HasColumnType("datetime");

                entity.Property(e => e.ScriptName)
                    .IsRequired()
                    .HasMaxLength(255);
            });

            modelBuilder.Entity<Sites>(entity =>
            {
                entity.HasIndex(e => e.ClientId)
                    .HasDatabaseName("IX_ClientId");

                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.Site).IsRequired();

                entity.HasOne(d => d.Client)
                   .WithMany(s => s.Sites)
                   .HasForeignKey(d => d.ClientId)
                   .HasConstraintName("FK_dbo.Sites_dbo.Clients_ClientId");
            });

            modelBuilder.Entity<SystemLogs>(entity =>
            {
                entity.HasIndex(e => e.EntitySnapshotId)
                    .HasDatabaseName("IX_EntitySnapshotId");

                entity.HasIndex(e => e.UserId)
                    .HasDatabaseName("IX_UserId");

                entity.Property(e => e.Id).HasDefaultValueSql("(newid())");

                entity.Property(e => e.ChangeCategory).HasMaxLength(50);

                entity.Property(e => e.ChangeFor).HasMaxLength(50);

                entity.Property(e => e.ChangeType).HasMaxLength(4000);

                entity.Property(e => e.EntityName).HasMaxLength(4000);

                entity.Property(e => e.IpAddress).HasMaxLength(4000);

                entity.Property(e => e.Page).HasMaxLength(4000);

                entity.Property(e => e.PrimaryKeyValue).HasMaxLength(4000);

                entity.Property(e => e.PropertyName).HasMaxLength(4000);

                entity.Property(e => e.Section).HasMaxLength(4000);

                entity.Property(e => e.SystemActivity).HasMaxLength(4000);

                entity.Property(e => e.UpdateDate).HasColumnType("datetime");

                entity.Property(e => e.UpdateFrom).HasMaxLength(4000);

                entity.Property(e => e.UpdateTo).HasMaxLength(4000);

                entity.HasOne(d => d.EntitySnapshot)
                    .WithMany(p => p.SystemLogs)
                    .HasForeignKey(d => d.EntitySnapshotId)
                    .HasConstraintName("FK_dbo.SystemLogs_dbo.EntitySnapshots_EntitySnapshotId");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.SystemLogs)
                    .HasForeignKey(d => d.UserId)
                    .HasConstraintName("FK_dbo.SystemLogs_dbo.Users_UserId");
            });

            modelBuilder.Entity<ThemeConfigurations>(entity =>
            {
                entity.HasIndex(e => e.ClientId)
                    .HasDatabaseName("IX_ClientId");

                entity.Property(e => e.Id).HasDefaultValueSql("(newid())");

                entity.Property(e => e.CreateDate).HasColumnType("datetime");

                entity.Property(e => e.LoginHelpText).HasMaxLength(2048);

                entity.Property(e => e.PrimaryColor).HasMaxLength(2048);

                entity.Property(e => e.SecondaryColor).HasMaxLength(2048);

                entity.Property(e => e.TertiaryColor).HasMaxLength(2048);

                entity.Property(e => e.UpdateDate).HasColumnType("datetime");

                entity.HasOne(d => d.Client)
                    .WithMany(p => p.ThemeConfigurations)
                    .HasForeignKey(d => d.ClientId)
                    .HasConstraintName("FK_dbo.ThemeConfigurations_dbo.Clients_ClientId");
            });

            modelBuilder.Entity<UserClaims>(entity =>
            {
                entity.Property(e => e.Id).HasDefaultValueSql("(newid())");

                entity.Property(e => e.ClaimType)
                    .IsRequired()
                    .HasMaxLength(4000);

                entity.Property(e => e.ClaimValue)
                    .IsRequired()
                    .HasMaxLength(4000);

                entity.Property(e => e.UserId).HasColumnName("UserID");
            });

            modelBuilder.Entity<UserLogins>(entity =>
            {
                entity.HasKey(e => new { e.LoginProvider, e.ProviderKey, e.UserId });

                entity.Property(e => e.LoginProvider).HasMaxLength(128);

                entity.Property(e => e.ProviderKey).HasMaxLength(128);

                entity.Property(e => e.UserId).HasColumnName("UserID");
            });

            modelBuilder.Entity<UserRoles>(entity =>
            {
                entity.HasKey(e => new { e.UserId, e.RoleId });

                entity.HasIndex(e => e.RoleId)
                    .HasDatabaseName("IX_RoleId");

                entity.HasIndex(e => e.UserId)
                    .HasDatabaseName("IX_UserId");

                entity.HasOne(d => d.Role)
                    .WithMany(p => p.UserRoles)
                    .HasForeignKey(d => d.RoleId)
                    .HasConstraintName("FK_dbo.UserRoles_dbo.Roles_RoleId");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.UserRoles)
                    .HasForeignKey(d => d.UserId)
                    .HasConstraintName("FK_dbo.UserRoles_dbo.Users_UserId");
            });

            modelBuilder.Entity<Users>(entity =>
            {
                entity.Property(e => e.Id).HasDefaultValueSql("(newid())");

                entity.Property(e => e.AgentId)
                    .IsRequired()
                    .HasMaxLength(256);

                entity.Property(e => e.Email).HasMaxLength(256);

                entity.Property(e => e.Extension).HasMaxLength(256);

                entity.Property(e => e.Fax).HasMaxLength(256);

                entity.Property(e => e.FirstName)
                    .IsRequired()
                    .HasMaxLength(256);

                entity.Property(e => e.LastName)
                    .IsRequired()
                    .HasMaxLength(256);

                entity.Property(e => e.LockoutEndDateUtc).HasColumnType("smalldatetime");

                entity.Property(e => e.PasswordHash).HasMaxLength(256);

                entity.Property(e => e.PasswordUpdateDate).HasColumnType("datetime");

                entity.Property(e => e.PhoneNumber)
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.SecurityStamp).HasMaxLength(4000);

                entity.Property(e => e.UserName)
                    .IsRequired()
                    .HasMaxLength(256);
            });

            modelBuilder.Entity<DataLog>(entity =>
            {
                entity.Property(e => e.Id).HasDefaultValueSql("(newid())");

                entity.Property(e => e.TimeStamp).HasColumnType("datetime");
                                                
            });

			modelBuilder.Entity<SiteVersions>(entity =>
			{
				entity.Property(e => e.Id).HasDefaultValueSql("(newid())");
                entity.Property(e => e.CreatedDate).HasColumnType("datetime");
				entity.Property(e => e.UpdatedDate).HasColumnType("datetime");
                entity.HasIndex(e => new {e.SiteId, e.Active}).HasDatabaseName("IX_SiteIdActive");
            });
			modelBuilder.Entity<Rules>(entity =>
			{
				entity.Property(e => e.Id).HasDefaultValueSql("(newid())");
				entity.HasIndex(e => e.ClientId)
				   .HasDatabaseName("IX_ClientId");
				entity.Property(e => e.CreatedDate).HasColumnType("datetime");
				entity.Property(e => e.UpdatedDate).HasColumnType("datetime");

				entity.HasOne(d => d.Client)
				  .WithMany(s => s.Rules)
				  .HasForeignKey(d => d.ClientId)
				  .HasConstraintName("FK_dbo.Rules_dbo.Clients_ClientId");

			});			
			modelBuilder.Entity<Apps>(entity =>
			{
				entity.Property(e => e.Id).HasDefaultValueSql("(newid())");
				entity.HasIndex(e => e.ClientId)
				   .HasDatabaseName("IX_ClientId");
				entity.Property(e => e.CreateDate).HasColumnType("datetime");
				entity.Property(e => e.UpdateDate).HasColumnType("datetime");				

				entity.HasOne(d => d.Client)
				  .WithMany(s => s.Apps)
				  .HasForeignKey(d => d.ClientId)
				  .HasConstraintName("FK_dbo.Apps_dbo.Clients_ClientId");

			});

		}
    }
}
